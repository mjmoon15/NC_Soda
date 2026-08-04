"use client";

import { useCallback, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { CircleCheck } from "lucide-react";
import { isDemoMode } from "@/lib/config";
import styles from "./EntityForm.module.css";

export type Errors<T> = Partial<Record<keyof T, string>>;

/**
 * Reusable controlled-form engine for the admin surface.
 *
 * It owns the values/errors state, runs the supplied `validate` on submit, and
 * — crucially — is HONEST about persistence: in demo mode it never writes
 * anywhere, it just surfaces an inline "connect Supabase to persist" notice.
 * Each concrete form (Product / Video / Asset) supplies its initial values, a
 * validator, and a render function for the fields.
 */
export function useEntityForm<T extends object>({
  initial,
  validate,
}: {
  initial: T;
  validate: (values: T) => Errors<T>;
}) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [submitted, setSubmitted] = useState<T | null>(null);

  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear a field's error as soon as the user edits it.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    setSubmitted(null);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>): boolean => {
      e.preventDefault();
      const found = validate(values);
      const hasErrors = Object.values(found).some(Boolean);
      setErrors(found);
      if (hasErrors) {
        setSubmitted(null);
        return false;
      }
      // Valid. In demo mode we deliberately do NOT persist anything.
      setSubmitted(values);
      return true;
    },
    [validate, values]
  );

  const reset = useCallback(() => {
    setValues(initial);
    setErrors({});
    setSubmitted(null);
  }, [initial]);

  return { values, errors, submitted, setField, handleSubmit, reset };
}

/** Layout shell: a 2-col grid of fields plus a trailing actions row. */
export function FormShell({
  onSubmit,
  children,
  actions,
  notice,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  actions: ReactNode;
  notice?: ReactNode;
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.grid}>{children}</div>
      {notice}
      <div className={styles.actions}>{actions}</div>
    </form>
  );
}

/**
 * The demo-mode success notice. Shown after a valid submit so the UI stays
 * honest: the change was accepted but is illustrative until Supabase is wired.
 */
export function DemoSubmitNotice({ entity }: { entity: string }) {
  return (
    <div className={`${styles.notice} ${styles.noticeSuccess}`} role="status">
      <CircleCheck size={18} className={styles.noticeIcon} />
      <span>
        {isDemoMode ? (
          <>
            <strong>Demo mode</strong> — connect Supabase to persist this{" "}
            {entity}. Your input validated cleanly and would be saved in a live
            environment.
          </>
        ) : (
          <>
            <strong>Saved.</strong> Your {entity} has been written to the
            database.
          </>
        )}
      </span>
    </div>
  );
}
