/**
 * Before/after drag comparison for upscale results. The "before" is the same image re-rendered at a coarse pixel block.
 * @startingPoint section="Media" subtitle="Before / after upscale comparison" viewport="700x420"
 */
export interface CompareSliderProps {
  /** Image URL. Without it a seeded placeholder is used */
  src?: string;
  /** Pixel block of the original side. Default 14 */
  beforeBlock?: number;
  /** Pixel block of the result side. Default 1 (crisp) */
  afterBlock?: number;
  seed?: number;
  beforeLabel?: string;
  afterLabel?: string;
  ratio?: string;
  /** Initial divider position 0–100 */
  initial?: number;
  style?: React.CSSProperties;
}
export declare function CompareSlider(props: CompareSliderProps): JSX.Element;
