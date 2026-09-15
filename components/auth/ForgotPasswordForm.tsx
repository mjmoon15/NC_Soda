"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { requestPasswordReset } from "@/lib/auth/actions";

/** Email-only form that kicks off a Supabase password-recovery email. */
export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    {}
  );

  if (state?.sent) {
    return (
      <p style={{ fontSize: "0.9rem", color: "var(--muted)", margin: 0 }}>
        If that email has an account, a reset link is on its way — check your
        inbox (and spam folder).
      </p>
    );
  }

  return (
    <form action={formAction} className="stack" style={{ gap: "0.9rem" }}>
      <div>
        <label className="label" htmlFor="email">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="field"
          placeholder="you@company.com"
        />
      </div>

      {state?.error ? (
        <p style={{ color: "var(--coral-600)", fontSize: "0.85rem" }}>
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={pending}
      >
        <Send size={16} />
        {pending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
