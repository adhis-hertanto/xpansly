"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button, SelectField, TextField } from "@/components/ui";
import { ctaFormMode } from "@/config/site";
import { submitEarlyAccess, validateRequired, validateWorkEmail } from "@/lib/forms";
import styles from "./EarlyAccessForm.module.css";

const ROLES = [
  "Founder / CEO",
  "Head of Marketing / CMO",
  "Marketing team member",
  "Revenue / Sales leader",
  "Agency or growth partner",
  "Other",
];

type FieldName = "name" | "email" | "company" | "role";
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const IDS: Record<FieldName, string> = {
  name: "cta-name",
  email: "cta-email",
  company: "cta-company",
  role: "cta-role",
};

/** Small client leaf: validates on submit, focuses the first invalid field, announces the result. */
export function EarlyAccessForm() {
  const full = ctaFormMode === "full";
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [focusTick, setFocusTick] = useState(0);
  const messageRef = useRef<HTMLDivElement>(null);
  const order: FieldName[] = full ? ["name", "email", "company", "role"] : ["email"];

  // Move focus to the first invalid field once the error state has rendered.
  useEffect(() => {
    if (!focusTick) return;
    const first = order.find((f) => errors[f]);
    if (first) document.getElementById(IDS[first])?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusTick]);

  // On success the form is hidden, so move focus to the confirmation.
  useEffect(() => {
    if (status === "success") messageRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "");

    const next: Errors = {};
    if (full) {
      next.name = validateRequired(get("name"), "name") ?? undefined;
      next.company = validateRequired(get("company"), "company") ?? undefined;
      next.role = get("role") ? undefined : "Choose your role.";
    }
    next.email = validateWorkEmail(get("email")) ?? undefined;
    const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v)) as Errors;
    setErrors(clean);
    if (Object.keys(clean).length) {
      setStatus("idle");
      setFocusTick((t) => t + 1);
      return;
    }

    setStatus("submitting");
    setServerError("");
    try {
      await submitEarlyAccess({
        email: get("email").trim(),
        ...(full
          ? { name: get("name").trim(), company: get("company").trim(), role: get("role") }
          : {}),
        source: "cta",
      });
      setStatus("success");
    } catch (err) {
      setServerError(err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate hidden={status === "success"} className={styles.form}>
        <div className={`${styles.fields} ${full ? "" : styles.single}`}>
          {full ? (
            <TextField
              id={IDS.name}
              name="name"
              label="Name"
              type="text"
              autoComplete="name"
              required
              error={errors.name}
            />
          ) : null}
          <TextField
            id={IDS.email}
            name="email"
            label="Work email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            error={errors.email}
          />
          {full ? (
            <>
              <TextField
                id={IDS.company}
                name="company"
                label="Company"
                type="text"
                autoComplete="organization"
                required
                error={errors.company}
              />
              <SelectField
                id={IDS.role}
                name="role"
                label="Your role"
                placeholder="Choose your role"
                defaultValue=""
                required
                error={errors.role}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </SelectField>
            </>
          ) : null}
        </div>

        <div className={styles.actions}>
          <Button type="submit" block loading={status === "submitting"}>
            Request early access
          </Button>
          <p className={`t-label-sm ${styles.caption}`}>No spam. Just a personal note when your place is ready.</p>
        </div>
      </form>

      {/* Always mounted so assistive tech announces changes. */}
      <div aria-live="polite" className={styles.status}>
        {status === "success" ? (
          <div ref={messageRef} tabIndex={-1} className={styles.success}>
            <p className={`t-h2 ${styles.successTitle}`}>You’re on the list.</p>
            <p className={`t-body ${styles.successBody}`}>
              Thanks for your interest. We’ll be in touch personally when your place is ready.
            </p>
          </div>
        ) : null}
        {status === "error" ? (
          <p role="alert" className={`t-body-sm ${styles.serverError}`}>
            {serverError}
          </p>
        ) : null}
      </div>
    </>
  );
}
