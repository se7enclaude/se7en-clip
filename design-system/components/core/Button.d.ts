/**
 * Pill button. Primary = signal red; use one primary per view.
 * @startingPoint section="Core" subtitle="Pill buttons: primary, secondary, ghost, outline, light" viewport="700x260"
 */
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'light';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon name shown before the label */
  icon?: string;
  /** Lucide icon name shown after the label */
  iconRight?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
