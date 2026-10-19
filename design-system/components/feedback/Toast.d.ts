export interface ToastProps {
  tone?: 'neutral' | 'success' | 'error' | 'accent';
  title: string;
  message?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
