import { Section } from "@/components/ui";
import { sectionIds } from "@/config/site";

/** The outcome (Figma 849:151). STUB: replaced by the section build. */
export function Outcome() {
  return (
    <Section id={sectionIds.outcome} labelledBy="outcome-title">
      <h2 id="outcome-title" className="t-h1">The outcome</h2>
    </Section>
  );
}
