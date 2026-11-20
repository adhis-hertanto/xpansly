import { Section } from "@/components/ui";
import { sectionIds } from "@/config/site";
import { ProblemStage } from "./ProblemStage";
import styles from "./Problem.module.css";

/** Copy verbatim from Figma 849:148. */
const cards = [
  {
    n: "01",
    title: "The decision is shared",
    body: "A B2B purchase involves a group of people, from the budget holder to the people who’ll use it every day. Win one and lose the rest, and the deal stalls.",
  },
  {
    n: "02",
    title: "The stack is in pieces",
    body: "CRM, ads, email, website analytics, enrichment. Each tool sees a slice of the account. None of them sees the whole thing.",
  },
  {
    n: "03",
    title: "The reporting is activity",
    body: "Clicks, opens and MQLs fill the dashboard. Then the board asks which accounts are actually going to close.",
  },
];

/**
 * The problem (Figma 849:148 + scroll scenes 865:138).
 * Server component: the copy lives in the DOM from the first byte and is never aria-hidden.
 * ProblemStage (client) owns the pinned stage, the 3D mark and the scroll mapping.
 */
export function Problem() {
  return (
    <Section id={sectionIds.problem} labelledBy="problem-title" contained={false} className={styles.section}>
      <noscript>
        <style>{`.${styles.stage}{--h:1;--a0:1;--a1:1;--a2:1;--scrim:1}`}</style>
      </noscript>
      <ProblemStage>
        <div className={styles.content} data-content>
          <h2 id="problem-title" className={`t-h1 ${styles.heading}`} data-heading>
            B2B deals are won by a committee. <br className={styles.br} />
            Most tools see one person at a time.
          </h2>
          <ul className={styles.cards}>
            {cards.map((c, i) => (
              <li key={c.n} className={`${styles.card}`} data-card style={{ ["--i" as string]: i }}>
                <span className={`t-label ${styles.index}`} aria-hidden="true">
                  {c.n}
                </span>
                <div className={styles.text}>
                  <h3 className={`t-h2 ${styles.title}`}>{c.title}</h3>
                  <p className={`t-body ${styles.body}`}>{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </ProblemStage>
    </Section>
  );
}
