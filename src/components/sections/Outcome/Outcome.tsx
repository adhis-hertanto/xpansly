import { Section } from "@/components/ui";
import { sectionIds } from "@/config/site";
import { OutcomeShowcase } from "./OutcomeShowcase";
import styles from "./Outcome.module.css";

/** The outcome (Figma 849:151). Header is static; the sticky panel and steps live in a small client leaf. */
export function Outcome() {
  return (
    <Section id={sectionIds.outcome} labelledBy="outcome-title" className={styles.section}>
      <header className={styles.header}>
        <h2 id="outcome-title" className={`t-h1 ${styles.title}`}>
          A pipeline number you can stand behind.
        </h2>
        <p className={`t-body-lg ${styles.lede}`}>
          Report on accounts and the people deciding, not clicks. When the board asks
          what&rsquo;s going to close, you&rsquo;ll have the answer and the evidence behind it.
        </p>
      </header>
      <OutcomeShowcase />
    </Section>
  );
}
