export interface IconButtonProps {
  /** Lucide icon name */
  icon: string;
  variant?: 'outline' | 'solid' | 'glass' | 'light';
  /** Diameter in px. Default 44 */
  size?: number;
  /** Accessible label + tooltip */
  label?: string;
  /** Selected state (inverted fill) — used in the sidebar rail */
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
