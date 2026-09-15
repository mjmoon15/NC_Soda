"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { setNewPassword } from "@/lib/auth/actions";

/** Password + confirm form for finishing an invite or password reset. */
export function SetPasswordForm() {
  const [state, formAction, pending] = useActionState(setNewPassword, {});

  return (
    <form action={formAction} className="stack" style={{ gap: "0.9rem" }}>
      <div>
        <label className="label" htmlFor="password">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="field"
          placeholder="At least 8 characters"
        />
      </div>
      <div>
        <label className="label" htmlFor="confirm">
          Confirm password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="field"
          placeholder="Type it again"
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
        <KeyRound size={16} />
        {pending ? "Saving…" : "Save password"}
      </button>
    </form>
  );
}
