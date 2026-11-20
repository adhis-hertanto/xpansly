import { Section } from "@/components/ui";
import { sectionIds } from "@/config/site";
import { AudienceCard } from "./AudienceCard";
import styles from "./WhoItsFor.module.css";
import { ASSETS } from "@/lib/paths";

/** Who it's for (Figma 849:152, hover states 863:140). */

const BASE = `${ASSETS}/who-its-for`;

const audiences = [
  {
    key: "b2b",
    label: "B2B SaaS and tech",
    title: "From founder-led to full marketing teams",
    body: "Whether you’re a founder running growth without a marketing hire or a marketing leader with a full team, Xpansly gives you one system to win the accounts that matter.",
    image: { name: "b2b-saas", width: 1264, height: 711 },
    cardClass: styles.cardFirst,
  },
  {
    key: "agencies",
    label: "Agencies",
    title: "Growth partners for B2B tech",
    body: "Run account-based growth for your B2B tech clients from one system, and show them results they can take to their own board.",
    image: { name: "agencies", width: 1263, height: 837 },
    cardClass: styles.cardSecond,
  },
] as const;

const notes = ["GDPR-native", "Built in the UK", "Human approval on every move"];

export function WhoItsFor() {
  return (
    <Section id={sectionIds.whoItsFor} labelledBy="whoItsFor-title" className={styles.section}>
      <header className={styles.header}>
        <h2 id="whoItsFor-title" className={`t-h1 ${styles.title}`}>
          Built for B2B tech, and the <br className={styles.br} />
          agencies that grow it.
        </h2>
      </header>

      <div className={styles.body}>
        <div className={styles.cards}>
          {audiences.map((a) => (
            <AudienceCard key={a.key} titleId={`whoItsFor-${a.key}-title`} className={`${styles.card} ${a.cardClass}`}>
              <picture className={styles.picture}>
                <source type="image/avif" srcSet={`${BASE}/${a.image.name}-${a.image.width}.avif`} />
                <source type="image/webp" srcSet={`${BASE}/${a.image.name}-${a.image.width}.webp`} />
                {/* Decorative: the label and title carry the meaning. */}
                <img
                  src={`${BASE}/${a.image.name}-${a.image.width}.webp`}
                  width={a.image.width}
                  height={a.image.height}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={styles.image}
                />
              </picture>

              <div className={`glass glass-rim ${styles.panel}`}>
                <div className={styles.info}>
                  <p className={`t-label ${styles.label}`}>{a.label}</p>
                  <h3 id={`whoItsFor-${a.key}-title`} className={`t-h2 ${styles.cardTitle}`}>
                    {a.title}
                  </h3>
                  {/* Always in the DOM so screen readers get it; only visually collapsed on desktop hover layouts. */}
                  <div className={styles.bodyWrap}>
                    <p className={`t-body ${styles.copy}`}>{a.body}</p>
                  </div>
                </div>
              </div>
            </AudienceCard>
          ))}
        </div>

        <ul className={styles.notes}>
          {notes.map((n) => (
            <li key={n} className={`t-label ${styles.note}`}>
              <span className={styles.dot} aria-hidden="true" />
              {n}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
