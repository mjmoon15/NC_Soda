import type { Metadata } from "next";
import { ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { signInDemo } from "@/lib/auth/actions";
import { isDemoMode } from "@/lib/config";
import styles from "./login.module.css";

export const metadata: Metadata = { title: "Partner sign in" };

export default function LoginPage() {
  return (
    <main className={`dot-grid ${styles.wrap}`}>
      <div className={styles.inner}>
        <div className={styles.card}>
          <span className={styles.mark}>
            <Sparkles size={22} />
          </span>
          <h1 className={styles.title}>Partner Portal</h1>
          <p className={styles.sub}>
            Sign in for SKU data, sell sheets, training, and POS assets.
          </p>

          {isDemoMode ? (
            <>
              <div className={styles.divider}>Demo personas</div>
              <div className={styles.actions}>
                <form action={signInDemo.bind(null, "rep")}>
                  <button className="btn btn-primary btn-block" type="submit">
                    <UserRound size={16} /> Continue as Sales Rep
                  </button>
                </form>
                <form action={signInDemo.bind(null, "admin")}>
                  <button className="btn btn-outline btn-block" type="submit">
                    <ShieldCheck size={16} /> Continue as Admin
                  </button>
                </form>
              </div>
              <p className={styles.note}>
                No Supabase configured — pick a persona to explore the gated
                surfaces.
              </p>
            </>
          ) : (
            <div style={{ textAlign: "left" }}>
              <LoginForm />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
