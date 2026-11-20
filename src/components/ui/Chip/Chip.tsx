import type { ReactNode } from "react";
import styles from "./Chip.module.css";

/** Glass eyebrow chip (hero and CTA). Pill, padding 8 16 8 12, gap 8, Label text. */
export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={["glass", "glass-pill", "t-label", styles.chip, className].filter(Boolean).join(" ")}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </p>
  );
}
