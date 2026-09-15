import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import styles from "../login/login.module.css";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <main className={`dot-grid ${styles.wrap}`}>
      <div className={styles.inner}>
        <div className={styles.card}>
          <span className={styles.mark}>
            <Mail size={22} />
          </span>
          <h1 className={styles.title}>Reset your password</h1>
          <p className={styles.sub}>
            Enter your work email and we&apos;ll send a link to set a new
            password.
          </p>
          <div style={{ textAlign: "left" }}>
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </main>
  );
}
