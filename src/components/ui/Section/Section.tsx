import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = ComponentPropsWithoutRef<"section"> & {
  /** Anchor id (see sectionIds in src/config/site.ts). */
  id: string;
  /** id of the section's heading, for aria-labelledby. */
  labelledBy: string;
  /** Wrap children in .container (side margins). Default true. */
  contained?: boolean;
  children: ReactNode;
};

/**
 * Section shell: semantic <section>, labelled by its heading, optional container.
 * Vertical padding is owned by each section's CSS module using --u.
 */
export function Section({ id, labelledBy, contained = true, children, className, ...rest }: Props) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={className} {...rest}>
      {contained ? <div className="container">{children}</div> : children}
    </section>
  );
}
