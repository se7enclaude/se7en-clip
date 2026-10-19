/**
 * The hero link field. Pill, monospace text, optional trailing action (usually a Button).
 * @startingPoint section="Forms" subtitle="Paste-a-link field with trailing action" viewport="700x320"
 */
export interface UrlInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Leading Lucide icon. Default "link" */
  icon?: string;
  /** Trailing element, typically <Button> */
  action?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function UrlInput(props: UrlInputProps): JSX.Element;
