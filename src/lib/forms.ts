/** Shared form helpers: validation and the (placeholder) submit handler. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Common personal mail domains; early access asks for a work email. */
const PERSONAL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "live.com",
  "yahoo.com",
  "yahoo.co.uk",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
]);

export function validateWorkEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return "Enter your work email.";
  if (!EMAIL_RE.test(v)) return "Enter a valid email address, like name@company.com.";
  const domain = v.split("@")[1]?.toLowerCase() ?? "";
  if (PERSONAL_DOMAINS.has(domain)) return "Please use your work email address.";
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  return value.trim() ? null : `Enter your ${label.toLowerCase()}.`;
}

export type EarlyAccessPayload = {
  email: string;
  name?: string;
  company?: string;
  role?: string;
  source: "hero" | "cta";
};

/**
 * Placeholder submit handler.
 * TODO(endpoint): replace with the real early-access endpoint (e.g. POST /api/early-access
 * or the CRM form API). Must return { ok: true } on success, or throw with a user-facing message.
 */
export async function submitEarlyAccess(payload: EarlyAccessPayload): Promise<{ ok: true }> {
  await new Promise((r) => setTimeout(r, 600));
  if (process.env.NODE_ENV !== "production") {
    console.info("[early-access] placeholder submit", payload);
  }
  return { ok: true };
}
