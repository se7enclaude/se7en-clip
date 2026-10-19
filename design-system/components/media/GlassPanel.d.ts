export interface GlassPanelProps {
  children?: React.ReactNode;
  padding?: number | string;
  radius?: string;
  /** "dark" = frosted glass over media, "solid" = opaque card */
  tone?: 'dark' | 'solid';
  style?: React.CSSProperties;
}
export declare function GlassPanel(props: GlassPanelProps): JSX.Element;
