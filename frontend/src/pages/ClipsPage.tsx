import clsx from "clsx";
import { ArrowLeft, Check as CheckIcon, Clapperboard, Copy, Crop, FolderOpen, KeyRound, Link2, Minus, Plus, RefreshCw, Scissors, Sparkles, Square, Trash2, Upload, WandSparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api, localMediaUrl } from "../api/client";
import { events } from "../api/ws";
import { LayoutEditor, type Box } from "../components/LayoutEditor";
import { Button, Empty, ErrorAlert, PageHead, Progress, Segmented, Select, Ticks } from "../components/ui";
import { useFileIntake } from "../hooks/useFileIntake";
import { duration as fmtDuration } from "../lib/format";
import { useApp } from "../store/app";
import "../styles/clip.css";

type Layout = "auto" | "stream" | "chat" | "face" | "fit";
type Captions = "tiktok" | "hormozi" | "neon" | "clean" | "none";

interface ClipLayout {
  mode: "stream" | "chat" | "face" | "fit";
  cam: number[] | null;
}

interface Clip {
  id: string;
  start: number;
  end: number;
  score: number;
  title: string;
  description: string;
  hashtags: string[];
  reasons: string[];
  why?: string;
  ai: boolean;
  layout: ClipLayout;
  captions: Captions;
  file: string | null;
  thumb: string | null;
  stale: boolean;
  rendered_at?: number;
}

interface Project {
  id: string;
  name: string;
  status: "new" | "queued" | "analyzing" | "ready" | "error" | "paused";
  step: string | null;
  error: { code?: string; message: string; hint?: string } | null;
  notes: string[];
  source: { url: string | null; path: string | null };
  video: { duration: number; width: number; height: number } | null;
  options: { count: number; min_len: number; max_len: number; layout: Layout; captions: Captions };
  layout: ClipLayout | null;
  clips: Clip[];
  stats: { words?: number; candidates?: number; chat?: number; analysis_seconds?: number };
  job?: string;
}

interface ProjectSummary {
  id: string;
  name: string;
  status: Project["status"];
  clips: number;
  duration: number | null;
  thumb: string | null;
  url: string | null;
  updated: number;
}

interface Live {
  percent: number;
  label: string;
  eta: number | null;
}

const LENGTHS: Record<string, [number, number]> = { short: [15, 35], medium: [20, 60], long: [45, 90] };
const STEPS: { id: string; label: string }[] = [
  { id: "download", label: "Téléchargement" },
  { id: "audio", label: "Son" },
  { id: "transcribe", label: "Transcription" },
  { id: "moments", label: "Moments forts" },
  { id: "judge", label: "Choix par l'IA" },
  { id: "layout", label: "Cadrage" },
  { id: "render", label: "Rendu" },
];
const LAYOUT_LABEL: Record<string, string> = { auto: "Auto", stream: "Cam + jeu", chat: "Cam + chat", face: "Visage suivi", fit: "Plein cadre" };
const LOGIN_ERRORS = ["members_only", "login_required", "private", "age_restricted"];
const isPatreon = (s: string) => /patreon\.com/i.test(s);

/** Connexion Patreon : fenêtre du site dans l'appli, la session est gardée chiffrée sur le PC. */
function usePatreonLogin() {
  const toast = useApp((s) => s.toast);
  const [connected, setConnected] = useState(false);
  const [opening, setOpening] = useState(false);
  const refresh = useCallback(() => {
    api.get<{ patreon: boolean }>("/api/clip/login").then((r) => setConnected(r.patreon)).catch(() => undefined);
  }, []);
  useEffect(() => {
    refresh();
    return events.on((ev) => {
      if (ev.type !== "clip_login") return;
      setOpening(false);
      refresh();
      if (ev.data?.ok) toast({ kind: "success", title: "Connecté à Patreon", body: "Les vidéos réservées aux membres sont maintenant accessibles." });
    });
  }, [refresh, toast]);
  const login = async () => {
    setOpening(true);
    try {
      await api.post("/api/clip/login/patreon");
    } catch (e: any) {
      setOpening(false);
      toast({ kind: "error", title: e.message, body: e.hint });
    }
  };
  const logout = async () => {
    await api.del("/api/clip/login/patreon");
    refresh();
  };
  return { connected, opening, login, logout };
}
const CAPTION_LABEL: Record<Captions, string> = { tiktok: "TikTok", hormozi: "Hormozi", neon: "Néon", clean: "Sobre", none: "Aucun" };

const isUrl = (s: string) => /^https?:\/\//i.test(s.trim());
const busy = (p: { status: string }) => p.status === "queued" || p.status === "analyzing";

function eta(sec: number | null | undefined) {
  if (sec == null || !isFinite(sec) || sec <= 0) return "";
  return sec < 90 ? `~${Math.round(sec)} s` : `~${Math.round(sec / 60)} min`;
}

/** se7en Clip : une longue vidéo → les meilleurs moments en clips verticaux sous-titrés. */
export function ClipsPage() {
  const toast = useApp((s) => s.toast);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [live, setLive] = useState<Record<string, Live>>({});

  const refresh = useCallback(() => {
    api.get<{ projects: ProjectSummary[] }>("/api/clip/projects").then((r) => setProjects(r.projects)).catch(() => undefined);
  }, []);

  useEffect(() => {
    refresh();
    return events.on((ev) => {
      if (ev.type === "clip_progress") {
        const d = ev.data;
        setLive((l) => ({ ...l, [d.project]: { percent: d.percent, label: d.label, eta: d.eta } }));
      } else if (ev.type === "clip_project") refresh();
    });
  }, [refresh]);

  const pending = useApp((s) => s.pendingUrls);
  useEffect(() => {
    if (pending?.length) useApp.getState().consumeUrls();
  }, [pending]);

  if (openId) return <ProjectView id={openId} live={live[openId]} onBack={() => { setOpenId(null); refresh(); }} />;

  return (
    <div className="page-inner wide">
      <PageHead eyebrow="se7en Clip" title="Clip farm" echo="TikTok · Shorts · Reels" sub="Une longue vidéo ou une rediff de stream → les meilleurs moments, en vertical, avec visage suivi et sous-titres." />
      <NewProject
        onCreated={(p) => {
          refresh();
          setOpenId(p.id);
        }}
        onError={(e) => toast({ kind: "error", title: e.message, body: e.hint })}
      />
      <div className="label" style={{ margin: "28px 0 12px" }}>Projets</div>
      {projects.length === 0 ? (
        <Empty icon={<Clapperboard size={22} />} title="Aucun projet pour l'instant" body="Collez un lien ou glissez une vidéo ci-dessus : se7en Clip trouve tout seul les passages qui feront des vues." />
      ) : (
        <div className="clip-projects">
          {projects.map((p) => {
            const l = live[p.id];
            return (
              <button key={p.id} className="clip-project card" onClick={() => setOpenId(p.id)}>
                <div className="clip-project-thumb">{p.thumb ? <img src={localMediaUrl(p.thumb)} alt="" /> : <Clapperboard size={20} />}</div>
                <div className="clip-project-body">
                  <div className="ellipsis" style={{ fontWeight: 600 }} title={p.name}>{p.name}</div>
                  <div className="mono faint" style={{ fontSize: 11 }}>
                    {[p.duration ? fmtDuration(p.duration) : null, p.url ? new URL(p.url).hostname.replace(/^www\./, "") : "fichier", p.clips ? `${p.clips} clips` : null].filter(Boolean).join(" · ")}
                  </div>
                  {busy(p) ? (
                    <div style={{ marginTop: 8 }}>
                      <Progress value={l?.percent ?? null} state="active" />
                      <div className="faint ellipsis" style={{ fontSize: 11, marginTop: 4 }}>{l?.label ?? "En attente…"}</div>
                    </div>
                  ) : (
                    <span className={clsx("clip-status", `is-${p.status}`)}>{statusText(p.status)}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function statusText(s: string) {
  return ({ ready: "Prêt", error: "Erreur", paused: "Arrêté", new: "Nouveau", queued: "En attente", analyzing: "Analyse…" } as Record<string, string>)[s] ?? s;
}

// ------------------------------------------------------------------ nouveau projet
function NewProject({ onCreated, onError }: { onCreated: (p: Project) => void; onError: (e: any) => void }) {
  const [source, setSource] = useState("");
  const patreon = usePatreonLogin();
  const [count, setCount] = useState("0");
  const [length, setLength] = useState("medium");
  const [layout, setLayout] = useState<Layout>("auto");
  const [captions, setCaptions] = useState<Captions>("tiktok");
  const [sending, setSending] = useState(false);

  const create = async (src: string) => {
    if (!src.trim()) return;
    setSending(true);
    try {
      const [min_len, max_len] = LENGTHS[length];
      const r = await api.post<{ project: Project }>("/api/clip/projects", { source: src.trim(), count: Number(count), min_len, max_len, layout, captions });
      setSource("");
      onCreated(r.project);
    } catch (e) {
      onError(e);
    } finally {
      setSending(false);
    }
  };

  const intake = useFileIntake({
    page: "clips",
    kind: "av",
    onFiles: (fs) => {
      const v = fs.find((f) => f.kind === "video");
      if (v) create(v.path);
    },
  });

  return (
    <div className="clip-hero card rise">
      <Ticks inset={12} />
      <input {...intake.inputProps} />
      <div className="clip-hero-input">
        <Link2 size={18} className="faint" />
        <input
          className="clip-url"
          placeholder="Collez un lien (Twitch, YouTube, Kick…) ou glissez une vidéo ici"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && isUrl(source) && create(source)}
          spellCheck={false}
        />
        <Button variant="ghost" icon={<Upload size={15} />} onClick={intake.pick}>Fichier</Button>
        <Button variant="primary" icon={<WandSparkles size={16} />} loading={sending} disabled={!isUrl(source)} onClick={() => create(source)}>
          Trouver les clips
        </Button>
      </div>
      {isPatreon(source) && (
        <div className={clsx("clip-hint", patreon.connected && "ok")}>
          <KeyRound size={14} />
          {patreon.connected ? (
            <>
              <span>Connecté à Patreon : les vidéos réservées aux membres sont accessibles. La connexion est gardée et renouvelée toute seule.</span>
              <Button size="sm" variant="ghost" onClick={patreon.logout}>Se déconnecter</Button>
            </>
          ) : (
            <>
              <span>Vidéo réservée aux membres ? Connecte-toi une fois à Patreon dans se7en Clip (ton mot de passe reste chez Patreon, la session est gardée chiffrée sur ce PC).</span>
              <Button size="sm" variant="primary" loading={patreon.opening} onClick={patreon.login}>Se connecter à Patreon</Button>
            </>
          )}
        </div>
      )}
      <div className="clip-options">
        <Opt label="Clips">
          <Segmented
            size="sm"
            value={count}
            onChange={setCount}
            options={[{ value: "0", label: "Auto", tip: "Selon la durée : environ 1 clip toutes les 4 minutes (1 h → 15 clips)" }, ...["5", "10", "15", "20"].map((v) => ({ value: v, label: v }))]}
          />
        </Opt>
        <Opt label="Durée">
          <Segmented size="sm" value={length} onChange={setLength} options={[{ value: "short", label: "15–35 s" }, { value: "medium", label: "20–60 s" }, { value: "long", label: "45–90 s" }]} />
        </Opt>
        <Opt label="Cadrage">
          <Segmented size="sm" value={layout} onChange={setLayout} options={(["auto", "stream", "chat", "face", "fit"] as Layout[]).map((v) => ({ value: v, label: LAYOUT_LABEL[v] }))} />
        </Opt>
        <Opt label="Sous-titres">
          <Segmented size="sm" value={captions} onChange={setCaptions} options={(Object.keys(CAPTION_LABEL) as Captions[]).map((v) => ({ value: v, label: CAPTION_LABEL[v] }))} />
        </Opt>
      </div>
    </div>
  );
}

function Opt({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="clip-opt">
      <span className="label">{label}</span>
      {children}
    </div>
  );
}

// ------------------------------------------------------------------ un projet
function ProjectView({ id, live, onBack }: { id: string; live?: Live; onBack: () => void }) {
  const toast = useApp((s) => s.toast);
  const [p, setP] = useState<Project | null>(null);
  const [editing, setEditing] = useState(false);
  const patreon = usePatreonLogin();
  const load = useCallback(() => api.get<Project>(`/api/clip/projects/${id}`).then(setP).catch((e) => toast({ kind: "error", title: e.message })), [id, toast]);

  useEffect(() => {
    load();
    return events.on((ev) => {
      if ((ev.type === "clip_project" && ev.data?.project === id) || (ev.type === "job" && ev.data?.kind === "clip" && ev.data?.status === "completed")) load();
    });
  }, [id, load]);

  if (!p) return <div className="page-inner wide" />;
  const running = busy(p);
  const lay = p.layout ?? p.clips[0]?.layout;
  const stepIndex = STEPS.findIndex((s) => s.id === p.step);

  const act = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      load();
    } catch (e: any) {
      toast({ kind: "error", title: e.message, body: e.hint });
    }
  };

  return (
    <div className="page-inner wide">
      <PageHead
        eyebrow={
          <button className="clip-back" onClick={onBack}>
            <ArrowLeft size={13} /> Projets
          </button>
        }
        title={<span className="ellipsis" style={{ maxWidth: 760, display: "inline-block", verticalAlign: "bottom" }}>{p.name}</span>}
        sub={[p.video ? fmtDuration(p.video.duration) : null, p.layout ? LAYOUT_LABEL[p.layout.mode] : null, p.stats.analysis_seconds ? `analysé en ${fmtDuration(p.stats.analysis_seconds)}` : null, p.stats.chat ? `${p.stats.chat} messages de chat` : null].filter(Boolean).join(" · ")}
        right={
          <>
            {running ? (
              <Button icon={<Square size={14} />} onClick={() => act(() => api.post(`/api/clip/projects/${id}/cancel`))}>Arrêter</Button>
            ) : (
              <>
                <Button icon={<FolderOpen size={15} />} onClick={() => act(() => api.post(`/api/clip/projects/${id}/open-folder`))}>Dossier</Button>
                {p.clips.length > 0 && <Button icon={<Crop size={15} />} onClick={() => setEditing(true)}>Cadrage</Button>}
                {p.clips.some((c) => c.stale || !c.file) && (
                  <Button variant="primary" icon={<RefreshCw size={15} />} onClick={() => act(() => api.post(`/api/clip/projects/${id}/render-all`))}>Refaire les rendus</Button>
                )}
                <Button icon={<Plus size={15} />} onClick={() => act(() => api.post(`/api/clip/projects/${id}/analyze`, { count: p.clips.length + 5 }))}>5 clips de plus</Button>
              </>
            )}
            <Button
              variant="ghost"
              iconOnly
              icon={<Trash2 size={15} />}
              tip="Supprimer le projet (les clips déjà exportés restent dans leur dossier)"
              onClick={() => act(async () => { await api.del(`/api/clip/projects/${id}`); onBack(); })}
            />
          </>
        }
      />

      {running && (
        <div className="card card-pad rise clip-run">
          <div className="clip-steps">
            {STEPS.filter((s) => s.id !== "download" || p.source.url).map((s) => {
              const k = STEPS.findIndex((x) => x.id === s.id);
              return (
                <div key={s.id} className={clsx("clip-step", k < stepIndex && "done", k === stepIndex && "on")}>
                  <span className="clip-step-dot">{k < stepIndex ? <CheckIcon size={11} strokeWidth={3} /> : null}</span>
                  {s.label}
                </div>
              );
            })}
          </div>
          <Progress value={live?.percent ?? null} state="active" large showValue />
          <div className="row" style={{ marginTop: 8 }}>
            <span className="faint ellipsis">{live?.label ?? (p.status === "queued" ? "En attente…" : "Démarrage…")}</span>
            <span className="spacer" />
            <span className="mono faint">{eta(live?.eta)}</span>
          </div>
        </div>
      )}

      {p.status === "error" && p.error && (
        <ErrorAlert
          error={{ code: "clip_failed", message: p.error.message, hint: LOGIN_ERRORS.includes(p.error.code ?? "") ? (isPatreon(p.source.url ?? "") ? "Ce post est réservé aux membres : connecte-toi à Patreon avec le bouton ci-dessous (un compte qui a accès à ce post), puis réessaie." : "Connecte-toi au site dans ton navigateur, puis choisis ce navigateur dans Réglages › Confidentialité › Cookies (ou importe un fichier cookies.txt).") : p.error.hint }}
          actions={
            <>
              {LOGIN_ERRORS.includes(p.error.code ?? "") &&
                (isPatreon(p.source.url ?? "") ? (
                  <Button icon={<KeyRound size={14} />} loading={patreon.opening} onClick={patreon.login}>{patreon.connected ? "Reconnecter Patreon" : "Se connecter à Patreon"}</Button>
                ) : (
                  <Button icon={<KeyRound size={14} />} onClick={() => useApp.getState().goSettings("privacy")}>Cookies</Button>
                ))}
              <Button icon={<RefreshCw size={14} />} onClick={() => act(() => api.post(`/api/clip/projects/${id}/analyze`, {}))}>Réessayer</Button>
            </>
          }
        />
      )}
      {p.status === "paused" && (
        <div className="card card-pad row" style={{ gap: 12 }}>
          <span>Analyse arrêtée.</span>
          <span className="spacer" />
          <Button variant="primary" icon={<RefreshCw size={14} />} onClick={() => act(() => api.post(`/api/clip/projects/${id}/analyze`, {}))}>Reprendre</Button>
        </div>
      )}
      {p.notes?.map((n) => (
        <div key={n} className="card card-pad faint" style={{ marginBottom: 12 }}>{n}</div>
      ))}

      <LayoutEditor
        open={editing}
        projectId={id}
        duration={p.video?.duration ?? 0}
        initial={{ mode: (lay?.mode ?? "fit") as any, cam: (lay?.cam as Box) ?? null, at: (p.clips[0]?.start ?? 0) + 2 }}
        onClose={() => setEditing(false)}
        onSave={async (v) => {
          await act(async () => {
            await api.put(`/api/clip/projects/${id}/layout`, { ...v, apply_all: true });
            await api.post(`/api/clip/projects/${id}/render-all`);
          });
          setEditing(false);
        }}
      />

      {p.clips.length > 0 && (
        <div className="clip-grid">
          {p.clips.map((c, i) => (
            <ClipCard key={c.id} project={p} clip={c} rank={i + 1} onChange={load} />
          ))}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ un clip
function ClipCard({ project, clip, rank, onChange }: { project: Project; clip: Clip; rank: number; onChange: () => void }) {
  const toast = useApp((s) => s.toast);
  const jobs = useApp((s) => s.jobs);
  const [title, setTitle] = useState(clip.title);
  const [copied, setCopied] = useState(false);
  const saveTimer = useRef<number | undefined>(undefined);
  useEffect(() => setTitle(clip.title), [clip.title]);

  const rendering = useMemo(
    () => Object.values(jobs).some((j) => j.kind === "clip" && (j.options as any)?.clip === clip.id && ["waiting", "processing"].includes(j.status)),
    [jobs, clip.id],
  );
  const base = `/api/clip/projects/${project.id}/clips/${clip.id}`;

  const patch = async (body: Partial<Clip>) => {
    try {
      await api.patch(base, body);
      onChange();
    } catch (e: any) {
      toast({ kind: "error", title: e.message });
    }
  };
  const rerender = async () => {
    try {
      await api.post(`${base}/render`);
      toast({ kind: "info", title: `Rendu du clip ${rank} lancé` });
    } catch (e: any) {
      toast({ kind: "error", title: e.message, body: e.hint });
    }
  };
  const copyText = async () => {
    const text = [clip.title, clip.description, clip.hashtags.join(" ")].filter(Boolean).join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  const nudge = (field: "start" | "end", d: number) => patch({ [field]: Math.round((clip[field] + d) * 10) / 10 } as Partial<Clip>);
  const len = clip.end - clip.start;
  const hot = clip.score >= 75;

  return (
    <div className={clsx("clip-card card rise", clip.stale && "is-stale")}>
      <div className="clip-video">
        {clip.file && !clip.stale ? (
          <video src={localMediaUrl(clip.file) + `&v=${clip.rendered_at ?? 0}`} poster={clip.thumb ? localMediaUrl(clip.thumb) : undefined} controls preload="none" />
        ) : (
          <div className="clip-video-empty">
            {rendering ? <span className="spin-dot" /> : <Scissors size={22} />}
            <span>{rendering ? "Rendu…" : clip.file ? "Modifié : à refaire" : "Pas encore rendu"}</span>
          </div>
        )}
        <span className={clsx("clip-score", hot && "hot")} title={clip.why || undefined}>
          {hot && <Sparkles size={11} />} {clip.score}
        </span>
        <span className="clip-rank">#{rank}</span>
      </div>
      <div className="clip-body">
        <input
          className="clip-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            window.clearTimeout(saveTimer.current);
            const v = e.target.value;
            saveTimer.current = window.setTimeout(() => patch({ title: v }), 700);
          }}
        />
        <div className="clip-tags">{clip.hashtags.join(" ")}</div>
        {clip.reasons?.length > 0 && (
          <div className="row" style={{ gap: 6, flexWrap: "wrap", marginTop: 6 }}>
            {clip.reasons.map((r) => <span key={r} className="clip-reason">{r}</span>)}
          </div>
        )}
        <div className="clip-trim">
          <span className="label">Début</span>
          <button onClick={() => nudge("start", -2)} title="2 s plus tôt"><Minus size={12} /></button>
          <span className="mono">{fmtDuration(clip.start)}</span>
          <button onClick={() => nudge("start", 2)} title="2 s plus tard"><Plus size={12} /></button>
          <span className="spacer" />
          <span className="label">Fin</span>
          <button onClick={() => nudge("end", -2)} title="2 s plus tôt"><Minus size={12} /></button>
          <span className="mono">{fmtDuration(clip.end)}</span>
          <button onClick={() => nudge("end", 2)} title="2 s plus tard"><Plus size={12} /></button>
        </div>
        <div className="mono faint" style={{ fontSize: 11, textAlign: "center" }}>{Math.round(len)} s</div>
        <div className="row" style={{ gap: 8, marginTop: 10 }}>
          <Select
            value={clip.layout.mode}
            options={(["stream", "chat", "face", "fit"] as const).map((v) => ({ value: v, label: LAYOUT_LABEL[v] }))}
            onChange={(v) =>
              patch({
                layout: {
                  ...clip.layout,
                  mode: v,
                  cam: v === "stream" || v === "chat" ? clip.layout.cam ?? project.layout?.cam ?? [0, 0, 0.3, 0.3] : clip.layout.cam,
                },
              })
            }
          />
          <Select value={clip.captions} options={(Object.keys(CAPTION_LABEL) as Captions[]).map((v) => ({ value: v, label: CAPTION_LABEL[v] }))} onChange={(v) => patch({ captions: v })} />
        </div>
        <div className="row" style={{ gap: 8, marginTop: 10 }}>
          {clip.stale || !clip.file ? (
            <Button variant="primary" size="sm" full icon={<RefreshCw size={13} />} loading={rendering} onClick={rerender}>Faire le rendu</Button>
          ) : (
            <Button size="sm" full icon={copied ? <CheckIcon size={13} /> : <Copy size={13} />} onClick={copyText}>{copied ? "Copié" : "Copier titre + hashtags"}</Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            iconOnly
            icon={<Trash2 size={13} />}
            tip="Retirer ce clip"
            onClick={async () => {
              await api.del(base);
              onChange();
            }}
          />
        </div>
      </div>
    </div>
  );
}
