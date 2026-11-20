import type { ReactNode } from "react";
import styles from "./HowItWorks.module.css";
import { ASSETS } from "@/lib/paths";

export type HowItWorksCardProps = {
  title: ReactNode;
  body: string;
  /** Base file name in /assets/how-it-works (without width or extension). */
  image: string;
  alt: string;
};

const STAGE_WIDTH = 574;
const STAGE_HEIGHT = 400;
const widths = [600, 1148] as const;

const srcSet = (image: string, ext: "avif" | "webp") =>
  widths.map((w) => `${ASSETS}/how-it-works/${image}-${w}.${ext} ${w}w`).join(", ");

/** One feature card: copy block, divider, then the mockup stage (flattened Figma raster). */
export function HowItWorksCard({ title, body, image, alt }: HowItWorksCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.text}>
        <h3 className={`t-h2 ${styles.title}`}>{title}</h3>
        <p className={`t-body-lg ${styles.body}`}>{body}</p>
      </div>
      <div className={styles.divider} aria-hidden="true" />
      <div className={styles.well}>
        <picture className={styles.stage}>
          <source type="image/avif" srcSet={srcSet(image, "avif")} sizes="(min-width: 1200px) 574px, (min-width: 768px) 44vw, 90vw" />
          <source type="image/webp" srcSet={srcSet(image, "webp")} sizes="(min-width: 1200px) 574px, (min-width: 768px) 44vw, 90vw" />
          <img
            src={`${ASSETS}/how-it-works/${image}-1148.webp`}
            alt={alt}
            width={STAGE_WIDTH}
            height={STAGE_HEIGHT}
            loading="lazy"
            decoding="async"
            className={styles.img}
          />
        </picture>
      </div>
    </article>
  );
}
