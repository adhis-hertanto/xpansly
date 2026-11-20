import { Section } from "@/components/ui";
import { sectionIds } from "@/config/site";

/** How it works (Figma 849:149). STUB: replaced by the section build. */
export function HowItWorks() {
  return (
    <Section id={sectionIds.howItWorks} labelledBy="howItWorks-title">
      <h2 id="howItWorks-title" className="t-h1">How it works</h2>
    </Section>
  );
}
