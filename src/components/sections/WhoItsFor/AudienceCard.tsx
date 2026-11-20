"use client";

import type { ReactNode } from "react";
import { bp, useMediaQuery } from "@/lib/motion";

/**
 * Card wrapper. The expand/collapse itself is pure CSS (see WhoItsFor.module.css).
 * This leaf only decides whether the card is a keyboard stop: with a fine hover pointer
 * on desktop the card is focusable (focus mirrors hover); when the cards are stacked
 * there is nothing to reveal, so no pointless tab stop is added.
 */
export function AudienceCard({
  titleId,
  className,
  children,
}: {
  titleId: string;
  className: string;
  children: ReactNode;
}) {
  const interactive = useMediaQuery(`${bp.desktop} and ${bp.hover}`);
  return (
    <article className={className} aria-labelledby={titleId} tabIndex={interactive ? 0 : undefined}>
      {children}
    </article>
  );
}
