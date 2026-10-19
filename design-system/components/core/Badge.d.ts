export interface BadgeProps {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'info' | 'solid' | 'inverse';
  icon?: string;
  /** Monospace, no uppercase — for resolutions, sizes, formats (1080p, 24 MB, MP4) */
  mono?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
