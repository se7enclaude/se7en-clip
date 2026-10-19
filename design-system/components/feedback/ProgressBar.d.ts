export interface ProgressBarProps {
  /** 0–100 */
  value?: number;
  tone?: 'accent' | 'success' | 'neutral';
  /** Track thickness px. Default 3 (hairline) */
  height?: number;
  showValue?: boolean;
  style?: React.CSSProperties;
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
