import { Section } from "@/components/ui";
import { sectionIds } from "@/config/site";
import { HowItWorksCard, type HowItWorksCardProps } from "./HowItWorksCard";
import styles from "./HowItWorks.module.css";

const cards: HowItWorksCardProps[] = [
  {
    title: "Map the committee",
    body: "Xpansly builds a live picture of each target account: who’s involved in the decision, what they care about and how engaged they are.",
    image: "map-the-committee",
    alt: "Xpansly buying committee view for Northwind showing four of six people engaged, with a note that Mira added IT Security",
  },
  {
    title: "Read the signals",
    body: "Website visits, replies, content and ad engagement, new hires. Mira reads them together and works out what they mean for each account.",
    image: "read-the-signals",
    alt: "Xpansly signals feed for Northwind listing a pricing page visit, a CFO reply, ad engagement and a new hire, with a Mira account summary",
  },
  {
    title: "Coordinate the next move",
    body: "Mira plans what should happen next for each person, across email, LinkedIn, paid media and your website.",
    image: "coordinate-the-next-move",
    alt: "Team channel where Mira shares a three-step plan for Northwind and an approval bar reads 3 moves ready",
  },
  {
    title: "Learn from every outcome",
    body: "Every campaign teaches the system something, so its decisions get sharper the longer you use it.",
    image: "learn-from-every-outcome",
    alt: "Mira memory panel saving a note about the CFO and suggesting pricing content, with a decision confidence meter",
  },
];

/** How it works (Figma 849:149): headline plus a 2x2 grid of feature cards. */
export function HowItWorks() {
  return (
    <Section id={sectionIds.howItWorks} labelledBy="howItWorks-title" className={styles.section}>
      <div className={`grid ${styles.header}`}>
        <h2 id="howItWorks-title" className={`t-h1 ${styles.headline}`}>
          <span className={styles.line}>One system. Every account.</span>{" "}
          <span className={styles.line}>Everyone in the room.</span>
        </h2>
      </div>
      <div className={styles.cards}>
        {cards.map((card) => (
          <HowItWorksCard key={card.image} {...card} />
        ))}
      </div>
    </Section>
  );
}
