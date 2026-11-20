import styles from "./HeroVisual.module.css";

const base = "/assets/hero";

type CardProps = {
  name: string;
  widths: [number, number];
  /** intrinsic (Figma) size of the exported inner card */
  w: number;
  h: number;
  /** approximate share of the stage width, for the sizes attribute */
  share: number;
  className: string;
  eager?: boolean;
};

function Card({ name, widths, w, h, share, className, eager }: CardProps) {
  const set = (ext: string) => widths.map((x) => `${base}/${name}-${x}.${ext} ${x}w`).join(", ");
  const sizes = `(min-width: 1200px) ${Math.round(share * 36)}vw, calc((100vw - 40px) * ${share})`;
  return (
    <div className={`glass glass-rim ${styles.card} ${className}`}>
      <picture>
        <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
        <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
        <img
          src={`${base}/${name}-${widths[0]}.webp`}
          alt=""
          width={w}
          height={h}
          decoding="async"
          loading={eager ? "eager" : "lazy"}
          className={styles.img}
        />
      </picture>
    </div>
  );
}

/**
 * Hero product mock (Figma 850:1957, 524 x 608): three glass cards and the "You" cursor,
 * absolutely composed inside an aspect-ratio box that scales with its width.
 * Only the inner cards are images; the glass containers are CSS (real backdrop blur).
 */
export function HeroVisual() {
  return (
    <div
      className={styles.stage}
      role="img"
      aria-label="Xpansly preview: Mira's morning message, accounts in motion and a suggested next move for Northwind."
    >
      <Card name="mira-message" widths={[904, 1356]} w={452} h={100} share={0.91} className={styles.mira} eager />
      <Card name="accounts" widths={[952, 1428]} w={476} h={246} share={0.96} className={styles.accounts} />
      <Card name="next-move" widths={[552, 828]} w={276} h={150} share={0.58} className={styles.next} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${base}/cursor-you.svg`} alt="" width={51} height={35} loading="lazy" className={styles.cursor} />
    </div>
  );
}
