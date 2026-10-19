"""« Se connecter à … » : une fenêtre du site dans l'appli, pour les vidéos réservées aux membres (Patreon…).

Les navigateurs récents (Chrome, Edge, Brave) chiffrent leurs cookies d'une façon que yt-dlp ne sait plus lire,
et les verrouillent tant qu'ils sont ouverts. Ici l'utilisateur se connecte dans une fenêtre WebView2 de l'appli ;
dès que la session est ouverte, ses cookies sont repris, ajoutés au magasin de cookies chiffré par Windows
(DPAPI, ``downloader/cookies.py``) et le mode « fichier » est activé. Le mot de passe n'est jamais vu par l'appli.
"""
from __future__ import annotations

import threading
import time
from email.utils import parsedate_to_datetime

from ..downloader import cookies as store
from ..errors import MediaLabError
from ..events import bus
from ..logging_setup import get_logger
from ..security import unprotect

log = get_logger("clip")

SITES = {
    "patreon": {"name": "Patreon", "url": "https://www.patreon.com/login", "domain": "patreon.com",
                "session": "session_id"},
}

_lock = threading.Lock()
_open: dict[str, object] = {}
_popup_ok: set[str] = set()  # fenêtres de connexion (uid pywebview) qui ont le droit d'ouvrir des pop-ups


def _allow_popups() -> None:
    """« Continuer avec Google / Apple / Facebook » ouvre un pop-up qui renvoie la connexion à la page d'origine
    (window.opener). pywebview intercepte tous les pop-ups (ouverts dans le navigateur, ou à la place de la page) :
    la connexion se perdait sur une page blanche. Pour nos fenêtres de connexion, on laisse WebView2 ouvrir
    son propre pop-up, relié à la page."""
    from webview.platforms import edgechromium as ec
    if getattr(ec.EdgeChrome, "_se7en_popups", False):
        return
    original = ec.EdgeChrome.on_new_window_request

    def on_new_window_request(self, sender, args):
        if getattr(self.pywebview_window, "uid", None) in _popup_ok:
            return  # non géré : WebView2 crée le pop-up lui-même
        return original(self, sender, args)

    ec.EdgeChrome.on_new_window_request = on_new_window_request
    ec.EdgeChrome._se7en_popups = True


def _ua_file():
    from ..config import paths
    return paths().data / "login_ua.json"


def user_agent(site_id: str) -> str:
    """Le navigateur de la fenêtre de connexion : Cloudflare lie la session à lui (sinon « Forbidden »)."""
    import json
    try:
        ua = json.loads(_ua_file().read_text("utf-8")).get(site_id)
        if ua:
            return ua
    except (OSError, ValueError):
        pass
    from .. import preflight
    major = (preflight.webview2_version() or "141.0.0.0").split(".")[0]
    return (f"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{major}.0.0.0 "
            f"Safari/537.36 Edg/{major}.0.0.0")


def _save_user_agent(site_id: str, ua: str) -> None:
    import json
    f = _ua_file()
    try:
        data = json.loads(f.read_text("utf-8")) if f.exists() else {}
    except (OSError, ValueError):
        data = {}
    data[site_id] = ua
    f.write_text(json.dumps(data), "utf-8")


def site_for(url: str) -> str | None:
    """Le site connecté qui correspond à ce lien (pour télécharger avec la même identité de navigateur)."""
    low = (url or "").lower()
    return next((sid for sid, s in SITES.items() if s["domain"] in low), None)


def _stored_lines() -> list[str]:
    p = store._store_path()
    if not p.exists():
        return []
    try:
        return [ln for ln in unprotect(p.read_bytes()).decode("utf-8", "replace").splitlines()
                if ln.strip() and not ln.startswith("#")]
    except OSError:
        return []


def status() -> dict:
    lines = _stored_lines()
    out = {}
    for sid, site in SITES.items():
        out[sid] = any(ln.split("\t")[0].lstrip(".").endswith(site["domain"]) and ln.split("\t")[5] == site["session"]
                       for ln in lines if len(ln.split("\t")) >= 7)
    return out


def _netscape(cookie) -> str | None:
    """Une ligne cookies.txt à partir d'un SimpleCookie de pywebview."""
    for name, morsel in cookie.items():
        domain = morsel["domain"] or ""
        if not domain:
            return None
        try:
            expiry = int(parsedate_to_datetime(morsel["expires"]).timestamp()) if morsel["expires"] else 0
        except (TypeError, ValueError):
            expiry = 0
        if expiry <= 0:
            expiry = int(time.time()) + 30 * 86400  # cookie de session : gardé 30 jours
        sub = "TRUE" if domain.startswith(".") else "FALSE"
        secure = "TRUE" if morsel["secure"] else "FALSE"
        return "\t".join([domain, sub, morsel["path"] or "/", secure, str(expiry), name, morsel.value])
    return None


def save_cookies(site_id: str, cookies: list) -> bool:
    """Remplace les cookies du site dans le magasin chiffré. Retourne vrai si la session est ouverte."""
    site = SITES[site_id]
    new = [ln for ln in (_netscape(c) for c in cookies) if ln and ln.split("\t")[0].lstrip(".").endswith(site["domain"])]
    if not any(ln.split("\t")[5] == site["session"] for ln in new):
        return False
    keep = [ln for ln in _stored_lines() if not ln.split("\t")[0].lstrip(".").endswith(site["domain"])]
    content = "# Netscape HTTP Cookie File\n" + "\n".join(keep + new) + "\n"
    store.import_cookies_file(content.encode("utf-8"))
    return True


def open_window(site_id: str, settings_store) -> dict:
    """Ouvre la fenêtre de connexion (appli avec sa fenêtre seulement)."""
    from .. import system
    if site_id not in SITES:
        raise MediaLabError("invalid", "Site inconnu.")
    if system.window is None:
        raise MediaLabError("no_window", "La connexion se fait depuis la fenêtre de se7en Clip.",
                            "Ouvrez se7en Clip normalement (pas dans le navigateur).")
    import webview
    site = SITES[site_id]
    with _lock:
        old = _open.get(site_id)
        if old is not None:
            try:
                old.show()  # type: ignore[attr-defined]
                return {"opened": True}
            except Exception:
                _open.pop(site_id, None)
        try:
            _allow_popups()
        except Exception as e:  # autre moteur de fenêtre : la connexion par e-mail marche quand même
            log.warning("Login popups not enabled: %s", e)
        win = webview.create_window(f"Se connecter à {site['name']} — se7en Clip", site["url"], width=520, height=780)
        _popup_ok.add(win.uid)
        _open[site_id] = win

    done = threading.Event()
    checking = threading.Lock()

    def check() -> None:
        # la session existe dès que le cookie de session apparaît (même si la page reste sur /login un instant)
        if done.is_set() or not checking.acquire(blocking=False):
            return
        try:
            if save_cookies(site_id, win.get_cookies()):
                done.set()
                try:
                    ua = win.evaluate_js("navigator.userAgent")
                    if ua:
                        _save_user_agent(site_id, str(ua))
                except Exception as e:  # sinon : déduit de la version de WebView2
                    log.debug("user agent: %s", e)
                settings_store.update({"privacy": {"cookies_mode": "file"}})
                log.info("Signed in to %s; session stored (encrypted)", site["name"])
                bus.publish("clip_login", {"site": site_id, "ok": True})
                time.sleep(1.2)
                win.destroy()
        except Exception as e:  # la page n'est pas encore prête : on réessaiera au prochain chargement
            log.debug("login check: %s", e)
        finally:
            checking.release()

    def on_closed() -> None:
        with _lock:
            _open.pop(site_id, None)
            _popup_ok.discard(win.uid)
        if not done.is_set():
            bus.publish("clip_login", {"site": site_id, "ok": False})

    closed = threading.Event()

    def poll() -> None:
        # après un pop-up Google, Patreon peut se connecter sans recharger la page : on vérifie régulièrement
        while not done.is_set() and not closed.wait(2.0):
            check()

    def on_closed_all() -> None:
        closed.set()
        on_closed()

    win.events.loaded += lambda: threading.Thread(target=check, daemon=True).start()
    win.events.closed += on_closed_all
    threading.Thread(target=poll, daemon=True, name="login-poll").start()
    return {"opened": True}


def refresh(site_id: str, timeout: float = 25.0) -> bool:
    """Renouvelle la session sans rien demander : une fenêtre invisible ouvre le site avec le profil de l'appli
    (toujours connecté), puis ses cookies frais remplacent les anciens (anti-robot renouvelé, changement
    d'adresse IP…). Retourne vrai si la session est toujours ouverte. Sans fenêtre d'appli : rien à faire."""
    from .. import system
    if system.window is None or site_id not in SITES:
        return False
    import webview
    site = SITES[site_id]
    loaded = threading.Event()
    win = webview.create_window(f"{site['name']} — se7en Clip", f"https://www.{site['domain']}/home", hidden=True,
                                width=900, height=700)
    win.events.loaded += loaded.set
    ok = False
    try:
        if not loaded.wait(timeout):
            log.info("Session refresh for %s: page did not load", site["name"])
            return False
        time.sleep(3)  # l'anti-robot et le site posent leurs cookies juste après le chargement
        ok = save_cookies(site_id, win.get_cookies())
        log.info("Session refresh for %s: %s", site["name"], "renewed" if ok else "not signed in any more")
    except Exception as e:
        log.info("Session refresh for %s failed: %s", site["name"], e)
    finally:
        try:
            win.destroy()
        except Exception:
            pass
    return ok


def logout(site_id: str) -> None:
    site = SITES[site_id]
    keep = [ln for ln in _stored_lines() if not ln.split("\t")[0].lstrip(".").endswith(site["domain"])]
    if keep:
        store.import_cookies_file(("# Netscape HTTP Cookie File\n" + "\n".join(keep) + "\n").encode("utf-8"))
    else:
        store.delete_cookies_file()
