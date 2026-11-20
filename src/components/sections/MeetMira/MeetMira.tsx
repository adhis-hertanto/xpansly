import { Section } from "@/components/ui";
import { sectionIds } from "@/config/site";
import styles from "./MeetMira.module.css";

const photoWidths = [640, 1024] as const;
const kpiWidths = [412, 684] as const;

const set = (base: string, widths: readonly number[], ext: "avif" | "webp") =>
  widths.map((w) => `/assets/mira/${base}-${w}.${ext} ${w}w`).join(", ");

/** Meet Mira (Figma 849:150): photo panel with KPI card on the left, green copy panel on the right. */
export function MeetMira() {
  return (
    <Section id={sectionIds.mira} labelledBy="mira-title" className={styles.section}>
      <div className={styles.row}>
        <div className={styles.media}>
          <picture className={styles.photoWrap}>
            <source type="image/avif" srcSet={set("mira-photo", photoWidths, "avif")} sizes="(min-width: 1200px) 592px, 100vw" />
            <source type="image/webp" srcSet={set("mira-photo", photoWidths, "webp")} sizes="(min-width: 1200px) 592px, 100vw" />
            <img
              src="/assets/mira/mira-photo-1024.webp"
              alt=""
              width={1024}
              height={1024}
              loading="lazy"
              decoding="async"
              className={styles.photo}
            />
          </picture>
          <picture className={styles.kpi}>
            <source type="image/avif" srcSet={set("mira-kpi", kpiWidths, "avif")} sizes="(min-width: 768px) 412px, 80vw" />
            <source type="image/webp" srcSet={set("mira-kpi", kpiWidths, "webp")} sizes="(min-width: 768px) 412px, 80vw" />
            <img
              src="/assets/mira/mira-kpi-684.webp"
              alt="Dashboard card showing new users, unique users, week 1 retention and session length against the previous 28 days"
              width={412}
              height={205}
              loading="lazy"
              decoding="async"
              className={styles.kpiImg}
            />
          </picture>
        </div>
        <div className={styles.copy}>
          <div className={styles.heading}>
            <p className={`t-label ${styles.eyebrow}`}>
              <span className={styles.marker} aria-hidden="true" />
              Meet Mira
            </p>
            <h2 id="mira-title" className={`t-h1 ${styles.title}`}>
              The thinking at the centre of it all.
            </h2>
          </div>
          <div className={styles.bodyGroup}>
            <div className={`t-body-lg ${styles.body}`}>
              <p>
                Mira knows your ideal customers, your buyers and your goals. When a signal comes in, she doesn&apos;t just log it. She
                works out what it means for that account and what should happen next, for every person involved.
              </p>
              <p>
                Your team stays in control. Mira recommends, you approve, and every result feeds back in, so the whole system keeps
                getting smarter.
              </p>
            </div>
            <p className={`t-label ${styles.caption}`}>Mira recommends. You approve.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
