import { Section } from "@/components/ui";
import { sectionIds } from "@/config/site";

/** Be first in. (Figma 848:24337). STUB: replaced by the section build. */
export function CtaFooter() {
  return (
    <Section id={sectionIds.cta} labelledBy="cta-title">
      <h2 id="cta-title" className="t-h1">Be first in.</h2>
    </Section>
  );
}
