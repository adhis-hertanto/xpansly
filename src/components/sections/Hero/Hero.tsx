import { Section } from "@/components/ui";
import { sectionIds } from "@/config/site";

/** Hero (Figma 849:147). STUB: replaced by the section build. */
export function Hero() {
  return (
    <Section id={sectionIds.hero} labelledBy="hero-title">
      <h2 id="hero-title" className="t-h1">Hero</h2>
    </Section>
  );
}
