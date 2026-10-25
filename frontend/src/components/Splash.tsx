import { CSSProperties, useEffect, useRef, useState } from "react";
import { useT } from "../i18n";
import "./splash-clip.css";

/* ---------------------------------------------------------------------------
   se7en Clip launch animation — « le montage », silent, about 2.4 s:
   a film strip races across the screen → it brakes → two cyan blade strokes
   cut one frame out → the frame lifts, turns from 16:9 into a vertical 9:16
   short, and the se7en clip wordmark plays inside it with a timecode and a
   progress line. On exit the short flicks up like a swiped clip.
   Click (or any key) to skip once the engine is ready.
   --------------------------------------------------------------------------- */

const HOLD = 2400;
const OUT = 520;
const FRAMES = 11;

export function Splash({ onDone, version, ready }: { onDone: () => void; version?: string; ready?: boolean }) {
  const t = useT();
  const [leaving, setLeaving] = useState(false);
  const [held, setHeld] = useState(false);
  const done = useRef(false);
  const readyRef = useRef(ready);
  readyRef.current = ready;

  const leave = () => {
    if (done.current) return;
    done.current = true;
    setLeaving(true);
    window.setTimeout(onDone, OUT);
  };

  useEffect(() => {
    const id = window.setTimeout(() => setHeld(true), HOLD);
    const key = () => readyRef.current && leave();
    window.addEventListener("keydown", key);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", key);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (held && ready) leave();
  }, [held, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`splash spk ${leaving ? "leaving" : ""}`} onClick={() => ready && leave()}>
      <div className="spk-strip">
        <div className="spk-track">
          {Array.from({ length: FRAMES }, (_, i) => (
            <span key={i} className={`spk-frame ${i === 5 ? "hero" : ""}`} style={{ "--h": (i * 37) % 360 } as CSSProperties} />
          ))}
        </div>
      </div>
      <span className="spk-cut a" />
      <span className="spk-cut b" />
      <div className="spk-short">
        <div className="spk-short-in">
          <span className="spk-rec"><i /> 0:59</span>
          <span className="spk-word">SE<b>7</b>EN</span>
          <span className="spk-app">CLIP</span>
          <span className="spk-progress"><i /></span>
        </div>
      </div>
      <div className="spk-tag">{t("splash.tagline")}</div>
      <div className="spk-foot">
        <span>v{version ?? ""}</span>
        <span className="spk-bar"><span className={ready ? "full" : ""} /></span>
        <span>{ready ? t("splash.skip") : t("splash.init")}</span>
      </div>
    </div>
  );
}
