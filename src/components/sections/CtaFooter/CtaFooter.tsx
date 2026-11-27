import { Chip, Section } from "@/components/ui";
import { PlanetCanvas } from "@/components/ui/PlanetArt/PlanetCanvas";
import { SIGNUP_SCENE } from "@/components/ui/PlanetArt/scenes";
import { sectionIds } from "@/config/site";
import { EarlyAccessForm } from "./EarlyAccessForm";
import styles from "./CtaFooter.module.css";
import { ASSETS, basePath } from "@/lib/paths";

/**
 * Be first in. + footer (Figma 848:24337).
 * CtaSection renders inside <main>. SiteFooter renders directly after </main> so it is a real
 * contentinfo landmark. The background art and scrim live in CtaSection and extend under the footer
 * (the section reserves --footer-h of bottom padding; SiteFooter is pulled up over it with a negative
 * margin and is transparent), so the two read as one 1083-high frame with no gap.
 */

const BG = `${ASSETS}/cta/cta-bg`;

export function CtaSection() {
  return (
    <Section id={sectionIds.cta} labelledBy="cta-title" contained={false} className={styles.section}>
      {/* Decorative art, native 1520x980, cover-fitted across CTA + footer. */}
      <picture className={styles.picture}>
        <source
          type="image/avif"
          srcSet={`${BG}-960.avif 960w, ${BG}-1520.avif 1520w`}
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet={`${BG}-960.webp 960w, ${BG}-1520.webp 1520w`}
          sizes="100vw"
        />
        <img
          src={`${BG}-1520.webp`}
          width={1520}
          height={980}
          alt=""
          loading="lazy"
          decoding="async"
          className={styles.image}
        />
      </picture>
      <PlanetCanvas scene={SIGNUP_SCENE} className={styles.planet} />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={`container grid ${styles.cta}`}>
        <div className={styles.content}>
          <div className={styles.intro}>
            <Chip>Now opening early access</Chip>
            <h2 id="cta-title" className={`t-display ${styles.title}`}>
              Be first in.
            </h2>
            <p className={`t-body-lg ${styles.lede}`}>
              We’re opening Xpansly to a small group of B2B tech teams first. Tell us a little about you and
              we’ll be in touch personally.
            </p>
          </div>

          <div className={`glass glass-rim ${styles.formGlass}`}>
            <div className={styles.formCard}>
              <EarlyAccessForm />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      {/* Not in Figma (848:24337 has no footer logo); added on request. Remove this img to match Figma exactly. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, small SVG: next/image adds nothing */}
      <img
        src={`${ASSETS}/brand/xpansly-logo.svg`}
        width={133}
        height={40}
        alt="Xpansly"
        loading="lazy"
        decoding="async"
        className={styles.logo}
      />
      <p className={`t-label-sm ${styles.legal}`}>
        © 2026 Xpansly · GDPR-native · Built in the UK ·{" "}
        {/* TODO(privacy): /privacy does not exist yet; build the page or update this href. */}
        <a href={`${basePath}/privacy`} className={styles.link}>
          Privacy Policy
        </a>
      </p>
    </footer>
  );
}

