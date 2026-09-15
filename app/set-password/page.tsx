import type { Metadata } from "next";
import { KeyRound } from "lucide-react";
import { SetPasswordForm } from "@/components/auth/SetPasswordForm";
import styles from "../login/login.module.css";

export const metadata: Metadata = { title: "Set your password" };

export default function SetPasswordPage() {
  return (
    <main className={`dot-grid ${styles.wrap}`}>
      <div className={styles.inner}>
        <div className={styles.card}>
          <span className={styles.mark}>
            <KeyRound size={22} />
          </span>
          <h1 className={styles.title}>Set your password</h1>
          <p className={styles.sub}>
            Choose a password for your Partner Portal account.
          </p>
          <div style={{ textAlign: "left" }}>
            <SetPasswordForm />
          </div>
        </div>
      </div>
    </main>
  );
}
