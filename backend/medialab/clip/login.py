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
        win = webview.create_window(f"Se connecter à {site['name']} — se7en Clip", site["url"], width=520, height=780)
        _open[site_id] = win

    done = threading.Event()

    def check() -> None:
        if done.is_set():
            return
        try:
            url = win.get_current_url() or ""
            if "/login" in url or "/signup" in url or "accounts" in url:
                return
            if save_cookies(site_id, win.get_cookies()):
                done.set()
                settings_store.update({"privacy": {"cookies_mode": "file"}})
                log.info("Signed in to %s; session stored (encrypted)", site["name"])
                bus.publish("clip_login", {"site": site_id, "ok": True})
                time.sleep(1.2)
                win.destroy()
        except Exception as e:  # la page n'est pas encore prête : on réessaiera au prochain chargement
            log.debug("login check: %s", e)

    def on_closed() -> None:
        with _lock:
            _open.pop(site_id, None)
        if not done.is_set():
            bus.publish("clip_login", {"site": site_id, "ok": False})

    win.events.loaded += lambda: threading.Thread(target=check, daemon=True).start()
    win.events.closed += on_closed
    return {"opened": True}


def logout(site_id: str) -> None:
    site = SITES[site_id]
    keep = [ln for ln in _stored_lines() if not ln.split("\t")[0].lstrip(".").endswith(site["domain"])]
    if keep:
        store.import_cookies_file(("# Netscape HTTP Cookie File\n" + "\n".join(keep) + "\n").encode("utf-8"))
    else:
        store.delete_cookies_file()
