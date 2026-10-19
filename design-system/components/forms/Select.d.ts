export interface SelectOption { value: string; label: string }
export interface SelectProps {
  /** Small uppercase caption above the value */
  label?: string;
  value?: string;
  options: Array<SelectOption | string>;
  onChange?: (value: string) => void;
  icon?: string;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
