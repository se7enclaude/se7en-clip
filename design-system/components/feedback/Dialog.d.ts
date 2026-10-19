export interface DialogProps {
  open?: boolean;
  title: string;
  /** Small uppercase red caption above the title */
  eyebrow?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose?: () => void;
  width?: number;
  style?: React.CSSProperties;
}
export declare function Dialog(props: DialogProps): JSX.Element;
