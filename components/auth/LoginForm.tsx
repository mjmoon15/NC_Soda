"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { signInPassword } from "@/lib/auth/actions";

/** Email + password form for real (Supabase) auth mode. */
export function LoginForm() {
  const [state, formAction, pending] = useActionState(signInPassword, {});

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
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field"
          placeholder="••••••••"
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
        <LogIn size={16} />
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
