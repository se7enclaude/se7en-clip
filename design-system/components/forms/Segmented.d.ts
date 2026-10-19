export interface SegmentedOption { value: string; label: string }
export interface SegmentedProps {
  options: Array<SegmentedOption | string>;
  value?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function Segmented(props: SegmentedProps): JSX.Element;
