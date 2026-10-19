"""Suivi du visage pour le recadrage vertical : une trajectoire de caméra douce, sans tremblement.

Entrée : des échantillons (temps, centre du visage en fraction de la largeur, ou ``None`` sans visage).
Sortie : la position horizontale du cadre 9:16 pour chaque image du clip.

Règles d'un bon cadreur :
* **zone morte** : tant que le visage reste dans le tiers central du cadre, la caméra ne bouge pas ;
* **mouvement amorti** : quand elle bouge, elle accélère et ralentit doucement (ressort critique) ;
* **coupe franche** : si le visage saute d'un coup (changement de plan, autre personne), on coupe au lieu de
  faire un long panoramique ;
* **sans visage** : la caméra reste où elle est (puis revient lentement au centre si cela dure).
"""
from __future__ import annotations

import math

Sample = tuple[float, float | None]


def fill(samples: list[Sample], hold: float = 2.5) -> list[tuple[float, float]]:
    """Comble les trous : garde la dernière position ``hold`` secondes, puis revient vers le centre."""
    out: list[tuple[float, float]] = []
    last: float | None = None
    last_t = 0.0
    first = next((x for _, x in samples if x is not None), 0.5)
    for t, x in samples:
        if x is not None:
            last, last_t = x, t
            out.append((t, x))
        elif last is None:
            out.append((t, first))
        elif t - last_t <= hold:
            out.append((t, last))
        else:
            k = min(1.0, (t - last_t - hold) / 3.0)
            out.append((t, last + (0.5 - last) * k))
    return out


def path(samples: list[Sample], fps: float, duration: float, crop_frac: float,
         dead_zone: float = 0.18, stiffness: float = 7.0, cut_jump: float = 0.22) -> list[float]:
    """Centre du cadre (fraction de la largeur source) pour chaque image.

    ``crop_frac`` : largeur du cadre 9:16 en fraction de la largeur source (ex. 0,316 pour du 16:9).
    """
    n = max(1, int(round(duration * fps)))
    pts = fill(sorted(samples, key=lambda s: s[0]))
    lo, hi = crop_frac / 2, 1 - crop_frac / 2
    if not pts or hi <= lo:
        return [0.5] * n

    def target_at(t: float) -> float:
        # interpolation linéaire entre échantillons
        if t <= pts[0][0]:
            return pts[0][1]
        for (t0, x0), (t1, x1) in zip(pts, pts[1:]):
            if t0 <= t <= t1:
                return x0 + (x1 - x0) * ((t - t0) / max(1e-6, t1 - t0))
        return pts[-1][1]

    cuts = {round(t1, 3) for (_, x0), (t1, x1) in zip(pts, pts[1:]) if abs(x1 - x0) > cut_jump}
    cut_times = sorted(cuts)
    dt = 1.0 / fps
    pos = min(hi, max(lo, target_at(0.0)))
    vel = 0.0
    out: list[float] = []
    ci = 0
    half_dead = dead_zone * crop_frac
    for i in range(n):
        t = i * dt
        goal = min(hi, max(lo, target_at(t)))
        if ci < len(cut_times) and t >= cut_times[ci]:
            # le visage a sauté : coupe nette sur la nouvelle position
            while ci < len(cut_times) and t >= cut_times[ci]:
                ci += 1
            pos, vel = goal, 0.0
        else:
            err = goal - pos
            if abs(err) > half_dead:
                aim = goal - math.copysign(half_dead, err) * 0.5
                # ressort amorti critique : pas de dépassement, pas d'oscillation
                acc = stiffness * stiffness * (aim - pos) - 2 * stiffness * vel
                vel += acc * dt
            else:
                vel *= 0.85  # dans la zone morte : la caméra s'arrête en douceur
            pos = min(hi, max(lo, pos + vel * dt))
        out.append(pos)
    return out


def sendcmd(xs: list[float], fps: float, src_w: int, crop_w: int, target: str = "crop@track") -> str:
    """Commandes FFmpeg ``sendcmd`` qui déplacent le recadrage image par image (seulement quand il bouge)."""
    lines = []
    last = None
    for i, c in enumerate(xs):
        x = int(round(min(src_w - crop_w, max(0, c * src_w - crop_w / 2))))
        x -= x % 2
        if x != last:
            lines.append(f"{i / fps:.4f} {target} x {x};")
            last = x
    return "\n".join(lines) + "\n"
