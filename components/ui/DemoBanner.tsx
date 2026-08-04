import { FlaskConical } from "lucide-react";
import { isDemoMode } from "@/lib/config";

/**
 * Thin banner shown whenever the app is running on seed data (no Supabase).
 * Makes it obvious to anyone running `npm run dev` that this is demo mode.
 */
export function DemoBanner() {
  if (!isDemoMode) return null;
  return (
    <div
      style={{
        background: "var(--ink)",
        color: "var(--cream)",
        fontSize: "0.8rem",
        textAlign: "center",
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
    >
      <FlaskConical size={14} />
      <span>
        Demo mode — running on seed data. Connect Supabase (see
        SETUP_CHECKLIST.md) to go live.
      </span>
    </div>
  );
}
