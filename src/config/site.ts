/** Site-wide configuration and copy shared across sections. */

export const site = {
  name: "Xpansly",
  url: "https://xpansly.ai",
  title: "Xpansly | The GTM Operating System for B2B Growth",
  description:
    "Xpansly is the GTM Operating System for B2B growth. See every account and everyone in the buying committee in one system. Now opening early access.",
} as const;

/** In-page anchors used by the nav. Section components use these ids. */
export const sectionIds = {
  hero: "top",
  problem: "the-problem",
  howItWorks: "how-it-works",
  mira: "meet-mira",
  outcome: "the-outcome",
  whoItsFor: "who-its-for",
  cta: "early-access",
} as const;

/**
 * CTA form fields.
 * "full"  = Name, Work email, Company, Role (as designed in Figma).
 * "email" = single work-email field (product principle for sign-up).
 * OPEN DECISION: confirm with product which one ships.
 */
export const ctaFormMode: "full" | "email" = "full";
