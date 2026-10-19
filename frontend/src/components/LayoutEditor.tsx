import { useEffect, useRef, useState } from "react";
import { mediaUrl } from "../api/client";
import { Button, Modal, Segmented } from "./ui";

export type Box = [number, number, number, number]; // x, y, w, h en fractions de l'image
export type Mode = "stream" | "chat" | "face" | "fit";

const MODES: { value: Mode; label: string }[] = [
  { value: "stream", label: "Cam + jeu" },
  { value: "chat", label: "Cam + chat" },
  { value: "face", label: "Visage suivi" },
  { value: "fit", label: "Plein cadre" },
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function fix([x, y, w, h]: Box): Box {
  w = clamp(w, 0.04, 1);
  h = clamp(h, 0.04, 1);
  return [clamp(x, 0, 1 - w), clamp(y, 0, 1 - h), w, h];
}

/** Rectangle déplaçable (glisser) et redimensionnable (coins) posé sur l'image. Le mouvement est suivi sur toute
 * la fenêtre : il continue même si la souris sort du cadre. */
function Rect({ box, color, label, onChange }: { box: Box; color: string; label: string; onChange: (b: Box) => void }) {
  const latest = useRef(onChange);
  latest.current = onChange;

  const start = (kind: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const host = (e.currentTarget as HTMLElement).closest(".le-stage") as HTMLElement;
    const r = host.getBoundingClientRect();
    const x0 = e.clientX, y0 = e.clientY, from = box;
    const move = (ev: PointerEvent) => {
      const dx = (ev.clientX - x0) / r.width;
      const dy = (ev.clientY - y0) / r.height;
      const [x, y, w, h] = from;
      const next: Box =
        kind === "move" ? [x + dx, y + dy, w, h]
        : kind === "br" ? [x, y, w + dx, h + dy]
        : kind === "tl" ? [x + dx, y + dy, w - dx, h - dy]
        : kind === "tr" ? [x, y + dy, w + dx, h - dy]
        : [x + dx, y, w - dx, h + dy];
      latest.current(fix(next));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const [x, y, w, h] = box;

  return (
    <div
      className="le-rect"
      style={{ left: `${x * 100}%`, top: `${y * 100}%`, width: `${w * 100}%`, height: `${h * 100}%`, borderColor: color }}
      onPointerDown={start("move")}
    >
      <span className="le-label" style={{ background: color }}>{label}</span>
      {(["tl", "tr", "bl", "br"] as const).map((k) => (
        <span key={k} className={`le-handle ${k}`} style={{ background: color }} onPointerDown={start(k)} />
      ))}
    </div>
  );
}

/** Réglage du cadrage d'un projet : mise en page + position de la cam. */
export function LayoutEditor({
  open,
  projectId,
  duration,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  projectId: string;
  duration: number;
  initial: { mode: Mode; cam: Box | null; at: number };
  onClose: () => void;
  onSave: (v: { mode: Mode; cam: Box | null }) => Promise<void>;
}) {
  const [mode, setMode] = useState<Mode>(initial.mode);
  const [cam, setCam] = useState<Box>(initial.cam ?? [0, 0, 0.3, 0.3]);
  const [at, setAt] = useState(initial.at);
  const [shown, setShown] = useState(initial.at);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMode(initial.mode);
    setCam(initial.cam ?? [0, 0, 0.3, 0.3]);
    setAt(initial.at);
    setShown(initial.at);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async () => {
    setSaving(true);
    try {
      await onSave({ mode, cam: mode === "stream" || mode === "chat" ? cam : null });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Cadrage"
      title="Régler le cadrage"
      width={860}
      actions={
        <>
          <Button onClick={onClose}>Annuler</Button>
          <Button variant="primary" loading={saving} onClick={save}>Appliquer à tous les clips</Button>
        </>
      }
    >
      <div className="col" style={{ gap: 12, marginTop: 8 }}>
        <Segmented value={mode} onChange={setMode} options={MODES} full />
        <p className="faint" style={{ margin: 0, fontSize: 12.5 }}>
          {mode === "stream" && "Encadrez la facecam : elle sera en haut du clip, le jeu en dessous."}
          {mode === "chat" && "Encadrez la facecam : elle sera en haut du clip, avec le chat de la rediff recréé en dessous (Twitch et YouTube)."}
          {mode === "face" && "Le cadre suit automatiquement le visage principal."}
          {mode === "fit" && "La vidéo entière au centre, sur un fond flouté."}
        </p>
        <div className="le-stage">
          <img src={mediaUrl(`/api/clip/projects/${projectId}/frame?t=${shown.toFixed(1)}`)} alt="" draggable={false} />
          {(mode === "stream" || mode === "chat") && <Rect box={cam} color="#22d3e6" label="Cam" onChange={setCam} />}
        </div>
        <div className="row" style={{ gap: 10 }}>
          <span className="label">Image</span>
          <input
            type="range"
            min={0}
            max={Math.max(1, duration)}
            step={1}
            value={at}
            onChange={(e) => setAt(Number(e.target.value))}
            onPointerUp={() => setShown(at)}
            onKeyUp={() => setShown(at)}
            style={{ flex: 1 }}
          />
        </div>
      </div>
    </Modal>
  );
}
