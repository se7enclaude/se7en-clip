import { AlertOctagon } from "lucide-react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { DropOverlay } from "./components/DropOverlay";
import { SetupBanner } from "./components/SetupBanner";
import { Splash } from "./components/Splash";
import { Toasts } from "./components/Toasts";
import { TopBar, Wordmark } from "./components/TopBar";
import { Button, Modal } from "./components/ui";
import { SHORTCUTS, useGlobalShortcuts } from "./hooks/useShortcuts";
import { resolveLang, translate, useT } from "./i18n";
import { UpdateBanner } from "./components/UpdateBanner";
import { UpdateLaunchNotice } from "./components/UpdateLaunchNotice";
import { ClipsPage } from "./pages/ClipsPage";
import { ConvertPage } from "./pages/ConvertPage";
import { DownloadPage } from "./pages/DownloadPage";
import { DuplicatesPage } from "./pages/DuplicatesPage";
import { HistoryPage } from "./pages/HistoryPage";
import { LogsPage } from "./pages/LogsPage";
import { PlayerPage } from "./pages/PlayerPage";
import { QueuePage } from "./pages/QueuePage";
import { SettingsPage } from "./pages/SettingsPage";
import { StatsPage } from "./pages/StatsPage";
import { StudioPage } from "./pages/StudioPage";
import { SubtitlesPage } from "./pages/SubtitlesPage";
import { TrimPage } from "./pages/TrimPage";
import { UpscalePage } from "./pages/UpscalePage";
import { Page as PageId, bootstrap, setTranslator, useApp } from "./store/app";

const PAGES: Record<PageId, () => ReactNode> = {
  clips: ClipsPage,
  download: DownloadPage,
  upscale: UpscalePage,
  queue: QueuePage,
  convert: ConvertPage,
  trim: TrimPage,
  studio: StudioPage,
  subtitles: SubtitlesPage,
  player: PlayerPage,
  history: HistoryPage,
  duplicates: DuplicatesPage,
  stats: StatsPage,
  settings: SettingsPage,
  logs: LogsPage,
};
// The player keeps playing (and the cutter keeps its file) when you switch tabs.
const KEEP_ALIVE: PageId[] = ["player", "trim", "subtitles"];
const SPLASH_KEY = "se7enclip.splash";

function splashEnabled(): boolean {
  try {
    return localStorage.getItem(SPLASH_KEY) !== "0";
  } catch {
    return true;
  }
}

export function App() {
  const t = useT();
  const ready = useApp((s) => s.ready);
  const bootError = useApp((s) => s.bootError);
  const page = useApp((s) => s.page);
  const settings = useApp((s) => s.settings);
  const version = useApp((s) => s.info?.version);
  const [help, setHelp] = useState(false);
  const [splash, setSplash] = useState(splashEnabled);
  const openHelp = useCallback(() => setHelp(true), []);
  useGlobalShortcuts(openHelp);

  useEffect(() => {
    bootstrap();
  }, []);

  // theme, motion, language, launch animation preference
  useEffect(() => {
    const g = settings?.general;
    if (!g) return;
    const apply = () => {
      const dark = g.theme === "dark" || (g.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
    };
    apply();
    document.documentElement.dataset.motion = g.reduce_motion ? "reduced" : "full";
    const lang = resolveLang(g.language);
    document.documentElement.lang = lang;
    setTranslator((k, v) => translate(lang, k, v));
    try {
      localStorage.setItem(SPLASH_KEY, g.launch_animation === false ? "0" : "1");
    } catch {
      /* ignore */
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [settings?.general]);

  // Settings → "Replay" (launch animation + its sound)
  useEffect(() => {
    const replay = () => setSplash(true);
    window.addEventListener("se7en:replay-splash", replay);
    return () => window.removeEventListener("se7en:replay-splash", replay);
  }, []);

  const [visited, setVisited] = useState<PageId[]>([]);
  useEffect(() => {
    if (KEEP_ALIVE.includes(page) && !visited.includes(page)) setVisited((v) => [...v, page]);
  }, [page, visited]);
  // The splash always sits at the same place in the tree: switching from "loading" to the app must not
  // remount it (that restarted the animation and its sound).
  const splashNode = splash && <Splash version={version} ready={ready || !!bootError} onDone={() => setSplash(false)} />;
  return (
    <>
      {body()}
      {splashNode}
    </>
  );

  function body() {
    if (bootError)
      return (
        <div className="app" style={{ display: "grid", placeItems: "center" }}>
          <div className="card card-pad rise" style={{ maxWidth: 480 }}>
            <div className="eyebrow row" style={{ gap: 8, marginBottom: 12 }}>
              <AlertOctagon size={14} /> {t("app.bootErrorEyebrow")}
            </div>
            <div className="modal-title">{t("app.bootError")}</div>
            <p className="muted" style={{ marginTop: 6 }}>
              {bootError}
            </p>
            <Button variant="primary" style={{ marginTop: 18 }} onClick={() => location.reload()}>
              {t("common.retry")}
            </Button>
          </div>
        </div>
      );

    if (!ready)
      return (
        <div className="app" style={{ display: "grid", placeItems: "center" }}>
          {!splash && (
            <div className="col rise" style={{ alignItems: "center", gap: 16 }}>
              <Wordmark size={44} />
              <span className="cursor-block" />
            </div>
          )}
        </div>
      );

    const Page = PAGES[page];
    const bleed = false;
    return (
      <div className="app">
        <TopBar onLogo={() => setSplash(true)} />
        <main className="main">
          <UpdateBanner />
          <UpdateLaunchNotice blocked={splash} />
          <SetupBanner />
          {/* Enter-only transition in CSS (design system: content rises 14px and fades in).
            No exit animation, so a paused animation frame can never block navigation. */}
          {!KEEP_ALIVE.includes(page) && (
            <div key={page} className={`page page-enter ${bleed ? "page-bleed" : ""}`}>
              <Page />
            </div>
          )}
          {KEEP_ALIVE.filter((p) => visited.includes(p) || p === page).map((p) => {
            const Kept = PAGES[p];
            return (
              <div key={p} className={`page ${p === page ? "page-enter" : "hidden"}`}>
                <Kept />
              </div>
            );
          })}
        </main>
        <Toasts />
        <DropOverlay />
        <Modal open={help} onClose={() => setHelp(false)} eyebrow="se7en" title={t("shortcuts.title")}>
          <div className="col" style={{ gap: 0, marginTop: 10 }}>
            {SHORTCUTS.map((s) => (
              <div key={s.key} className="toggle-row">
                <span className="toggle-row-text">{t(s.key)}</span>
                <span className="kbd">{s.keys}</span>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    );
  }
}
