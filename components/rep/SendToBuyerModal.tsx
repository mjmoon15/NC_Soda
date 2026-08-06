"use client";

import { useState } from "react";
import { Check, Mail, Send, X } from "lucide-react";
import type { Asset } from "@/lib/types";
import styles from "./SendToBuyerModal.module.css";

/** "Send to buyer" button + popover form for a single asset. Posts to
 * /api/rep/send-asset, which mints a fresh 7-day signed link and emails it
 * via Resend with the signed-in rep as replyTo. */
export function SendToBuyerModal({ asset }: { asset: Asset }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function close() {
    setOpen(false);
    setStatus("idle");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/rep/send-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: asset.id,
          buyerEmail: form.get("buyerEmail"),
          buyerName: form.get("buyerName") || undefined,
          note: form.get("note") || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-outline btn-sm btn-block"
        onClick={() => setOpen(true)}
      >
        <Mail size={15} />
        Send to buyer
      </button>

      {open && (
        <div className={styles.overlay} onClick={close}>
          <div
            className={styles.panel}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Send ${asset.title} to a buyer`}
          >
            <button
              type="button"
              className={styles.close}
              onClick={close}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {status === "sent" ? (
              <div className={styles.sentState}>
                <span className={styles.sentIcon}>
                  <Check size={20} />
                </span>
                <strong>Sent.</strong>
                <p className="muted" style={{ fontSize: "0.88rem" }}>
                  {asset.title} is on its way, with a 7-day download link.
                </p>
                <button type="button" className="btn btn-outline btn-sm" onClick={close}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="stack" style={{ gap: "0.85rem" }}>
                <div className="stack" style={{ gap: 2 }}>
                  <strong style={{ fontSize: "0.95rem" }}>Send to buyer</strong>
                  <span className="muted" style={{ fontSize: "0.82rem" }}>
                    {asset.title}
                  </span>
                </div>

                <div>
                  <label className="label" htmlFor="buyerEmail">
                    Buyer email
                  </label>
                  <input
                    id="buyerEmail"
                    name="buyerEmail"
                    type="email"
                    required
                    autoFocus
                    className="field"
                    placeholder="buyer@company.com"
                  />
                </div>

                <div>
                  <label className="label" htmlFor="buyerName">
                    Buyer name (optional)
                  </label>
                  <input
                    id="buyerName"
                    name="buyerName"
                    type="text"
                    className="field"
                    placeholder="Jane Buyer"
                  />
                </div>

                <div>
                  <label className="label" htmlFor="note">
                    Note (optional)
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    className="field"
                    rows={3}
                    placeholder="Here's the sheet we talked about…"
                  />
                </div>

                {status === "error" && error ? (
                  <p style={{ color: "var(--coral-600)", fontSize: "0.85rem" }}>{error}</p>
                ) : null}

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={status === "sending"}
                >
                  <Send size={15} />
                  {status === "sending" ? "Sending…" : "Send"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
