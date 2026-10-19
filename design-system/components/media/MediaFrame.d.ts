export interface MediaFrameProps {
  /** Image URL. When omitted a seeded abstract placeholder is painted */
  src?: string;
  /** Small mono caption bottom-right */
  label?: string;
  /** CSS aspect-ratio. Default "16/9" */
  ratio?: string;
  radius?: string;
  kind?: 'video' | 'photo' | 'audio';
  /** Pixel block size (1 = crisp) */
  block?: number;
  seed?: number;
  /** Overlay content (badges, play button) */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function MediaFrame(props: MediaFrameProps): JSX.Element;
