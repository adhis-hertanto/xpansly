import type { InputHTMLAttributes, ReactNode, Ref, SelectHTMLAttributes } from "react";
import styles from "./Field.module.css";

type BaseProps = {
  id: string;
  label: string;
  /** Visually hide the label (still read by screen readers). */
  hideLabel?: boolean;
  error?: string | null;
  className?: string;
};

/** Text input. Figma 850:1952: Neutral 900 fill, 1px Neutral 700 inside border, radius 8, h56, px16, Body. */
export function TextField({
  id,
  label,
  hideLabel,
  error,
  className,
  ref,
  ...input
}: BaseProps & InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  const errId = `${id}-error`;
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <label htmlFor={id} className={hideLabel ? "sr-only" : `t-label ${styles.label}`}>
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        className={`t-body ${styles.control}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        {...input}
      />
      <FieldError id={errId} error={error} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  hideLabel,
  error,
  className,
  placeholder,
  children,
  ref,
  ...select
}: BaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    placeholder?: string;
    children: ReactNode;
    ref?: Ref<HTMLSelectElement>;
  }) {
  const errId = `${id}-error`;
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <label htmlFor={id} className={hideLabel ? "sr-only" : `t-label ${styles.label}`}>
        {label}
      </label>
      <div className={styles.selectWrap}>
        <select
          ref={ref}
          id={id}
          className={`t-body ${styles.control} ${styles.select}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          {...select}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {children}
        </select>
        <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      <FieldError id={errId} error={error} />
    </div>
  );
}

function FieldError({ id, error }: { id: string; error?: string | null }) {
  return (
    <p id={id} className={`t-caption ${styles.error}`} role={error ? "alert" : undefined} hidden={!error}>
      {error}
    </p>
  );
}
