/**
 * A row in the download queue: thumbnail, title, source domain, spec badges, progress and a circular action.
 * @startingPoint section="Media" subtitle="Download queue rows in every status" viewport="700x400"
 */
export interface DownloadItemProps {
  title: string;
  /** Source domain, shown in mono */
  source?: string;
  kind?: 'video' | 'photo' | 'audio';
  /** Mono spec badges, e.g. ["MP4","1080p","48 MB"] */
  specs?: string[];
  status?: 'queued' | 'downloading' | 'upscaling' | 'done' | 'error';
  /** 0–100 */
  progress?: number;
  /** e.g. "12.4 MB/s" */
  speed?: string;
  onAction?: () => void;
  style?: React.CSSProperties;
}
export declare function DownloadItem(props: DownloadItemProps): JSX.Element;
