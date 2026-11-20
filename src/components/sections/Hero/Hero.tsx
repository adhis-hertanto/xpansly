import { Chip, Section } from "@/components/ui";
import { sectionIds } from "@/config/site";
import { HeroForm } from "./HeroForm";
import { HeroVisual } from "./HeroVisual";
import styles from "./Hero.module.css";

const bg = "/assets/hero/hero-bg";

/**
 * Hero (Figma 849:147 + background 848:16504 / scrim 848:16501).
 * The background art is the likely LCP element: eager, high priority, explicit size.
 * The nav floats above this section, so the art runs behind it.
 */
export function Hero() {
  const set = (ext: string) =>
    [828, 1440, 2880].map((w) => `${bg}-${w}.${ext} ${w}w`).join(", ");
  // Below 768 the art sits under a 62% dark overlay, so the 1440 file is plenty even at 3x DPR.
  const sizes = "(min-width: 1200px) 100vw, (min-width: 768px) 1458px, 540px";

  return (
    <Section id={sectionIds.hero} labelledBy="hero-title" contained={false} className={styles.hero}>
      <div className={styles.bg} aria-hidden="true">
        <picture>
          <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
          <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
          <img
            src={`${bg}-1440.webp`}
            alt=""
            width={2880}
            height={1778}
            fetchPriority="high"
            loading="eager"
            decoding="auto"
            className={styles.bgImg}
          />
        </picture>
        <div className={styles.scrim} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={`grid ${styles.grid}`}>
          <div className={styles.copy}>
            <div className={styles.intro}>
              <Chip className={styles.chip}>Now opening early access</Chip>
              <h1 id="hero-title" className={`t-display ${styles.title}`}>
                Orchestrate everything. <br />
                Own the outcome.
              </h1>
            </div>
            <p className={`t-body-lg ${styles.body}`}>
              The GTM Operating System for B2B tech. Xpansly brings your accounts, people, channels and
              data into one system, then coordinates everyone involved in the buying decision until the
              deal is done.
            </p>
            <div className={styles.signup}>
              <HeroForm />
              <p className={`t-label ${styles.caption}`}>
                For B2B SaaS and tech teams, and the agencies that grow them
              </p>
            </div>
          </div>

          <div className={styles.visual}>
            <HeroVisual />
          </div>
        </div>
      </div>
    </Section>
  );
}
