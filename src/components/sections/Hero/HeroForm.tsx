"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button, TextField } from "@/components/ui";
import { submitEarlyAccess, validateWorkEmail } from "@/lib/forms";
import styles from "./HeroForm.module.css";

const EMAIL_ID = "hero-email";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Hero sign-up: one work-email field and a submit button (single field is a product principle).
 * Client leaf: validates on submit, focuses the field on error, announces the result politely.
 */
export function HeroForm() {
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");

    const error = validateWorkEmail(email);
    setFieldError(error);
    if (error) {
      setStatus("idle");
      setMessage("");
      document.getElementById(EMAIL_ID)?.focus();
      return;
    }

    setStatus("submitting");
    setMessage("");
    try {
      await submitEarlyAccess({ email: email.trim(), source: "hero" });
      setStatus("success");
      setMessage("Thanks, you’re on the list. We’ll email you when early access opens.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (fieldError && !validateWorkEmail(e.target.value)) setFieldError(null);
  }

  return (
    <div className={styles.wrap}>
      <form onSubmit={onSubmit} noValidate className={styles.form}>
        <TextField
          id={EMAIL_ID}
          name="email"
          label="Work email"
          hideLabel
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your work email"
          required
          error={fieldError}
          onChange={onChange}
          className={styles.field}
        />
        <Button type="submit" loading={status === "submitting"} className={styles.submit}>
          Join early access
        </Button>
      </form>
      {/* Always mounted so assistive tech registers the live region before it changes. */}
      <p
        className={`t-caption ${styles.message} ${status === "error" ? styles.messageError : ""}`}
        role={status === "error" ? "alert" : "status"}
        aria-live={status === "error" ? "assertive" : "polite"}
      >
        {message}
      </p>
    </div>
  );
}
