"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/utils";
import styles from "./EntityForm.module.css";

/** Shared field wrapper: label + control + inline error message. */
export function Field({
  id,
  label,
  error,
  full,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={full ? styles.full : undefined}>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <span className={styles.errorText} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

type TextProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
};

/** Controlled text input wired to the EntityForm validation styling. */
export function TextInput({
  id,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: TextProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cx("field", error && styles.fieldError)}
      aria-invalid={error ? true : undefined}
    />
  );
}

/** Controlled textarea variant. */
export function TextArea({
  id,
  name,
  value,
  onChange,
  error,
  rows = 3,
  placeholder,
}: TextProps & { rows?: number }) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cx("field", error && styles.fieldError)}
      aria-invalid={error ? true : undefined}
    />
  );
}

/** Controlled <select>. */
export function SelectInput({
  id,
  name,
  value,
  onChange,
  error,
  options,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cx("field", error && styles.fieldError)}
      aria-invalid={error ? true : undefined}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Inline checkbox row. */
export function CheckboxRow({
  id,
  name,
  checked,
  onChange,
  children,
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className={styles.checkboxRow} htmlFor={id}>
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {children}
    </label>
  );
}
