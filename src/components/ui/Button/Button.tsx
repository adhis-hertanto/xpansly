import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

/** Figma component set "Landing page/Button" (853:140): Type = Primary | Secondary. */
type Variant = "primary" | "secondary";

type Common = {
  variant?: Variant;
  /** Stretch to the container width (e.g. CTA form). */
  block?: boolean;
  /** Shows a busy state and sets aria-busy. */
  loading?: boolean;
  children: ReactNode;
  className?: string;
};

type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: AsButton | AsLink) {
  const { variant = "primary", block, loading, children, className, ...rest } = props;
  const cls = [styles.button, styles[variant], block && styles.block, className]
    .filter(Boolean)
    .join(" ");

  if (typeof rest.href === "string") {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  const { type = "button", disabled, ...btn } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...btn}
    >
      {children}
    </button>
  );
}
