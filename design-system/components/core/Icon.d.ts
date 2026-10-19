export interface IconProps {
  /** Lucide icon name, kebab-case (e.g. "download", "arrow-up-right", "sparkles") */
  name: string;
  /** Pixel size. Default 18 */
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
