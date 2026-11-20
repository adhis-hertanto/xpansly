import { Section } from "@/components/ui";
import { sectionIds } from "@/config/site";

/** The problem (Figma 849:148). STUB: replaced by the section build. */
export function Problem() {
  return (
    <Section id={sectionIds.problem} labelledBy="problem-title">
      <h2 id="problem-title" className="t-h1">The problem</h2>
    </Section>
  );
}
