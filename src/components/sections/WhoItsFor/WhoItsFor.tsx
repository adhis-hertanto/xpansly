import { Section } from "@/components/ui";
import { sectionIds } from "@/config/site";

/** Who it's for (Figma 849:152). STUB: replaced by the section build. */
export function WhoItsFor() {
  return (
    <Section id={sectionIds.whoItsFor} labelledBy="whoItsFor-title">
      <h2 id="whoItsFor-title" className="t-h1">Who it’s for</h2>
    </Section>
  );
}
