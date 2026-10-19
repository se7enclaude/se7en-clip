/**
 * The se7en signature: an image rendered at a chosen pixel-block size, optionally animating from coarse to crisp ("pixel-resolve").
 * @startingPoint section="Media" subtitle="Pixel-resolve image — the brand's signature motif" viewport="700x420"
 */
export interface PixelImageProps {
  /** Image URL. Without it a seeded abstract red/black placeholder is painted */
  src?: string;
  /** Final pixel-block size in px. 1 = crisp */
  block?: number;
  /** If set, animates from this block size down to `block` */
  animateFrom?: number;
  /** Resolve duration ms. Default 1400 */
  duration?: number;
  /** Seed for the placeholder composition */
  seed?: number;
  ratio?: string;
  /** Draw a dark LED grid between blocks when block ≥ 6. Default true */
  grid?: boolean;
  radius?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function PixelImage(props: PixelImageProps): JSX.Element;
