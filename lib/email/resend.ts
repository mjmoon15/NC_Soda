import { Resend } from "resend";
import { isResendConfigured, RESEND_API_KEY, RESEND_FROM_EMAIL } from "@/lib/config";
import { SITE } from "@/lib/config";

export interface SendAssetEmailInput {
  buyerEmail: string;
  buyerName?: string;
  repName: string;
  repEmail: string;
  repCompany?: string;
  assetTitle: string;
  assetDescription?: string;
  fileType: string;
  downloadUrl: string;
  note?: string;
}

/**
 * Server-only. Emails a gated asset's signed download link to a buyer on a
 * rep's behalf. Callers MUST have already verified hasAccess(user, "rep") —
 * same pattern as lib/mux/server.ts and lib/data's signAssetUrl().
 *
 * Returns { ok: true } on success, or { ok: false, error } — never throws,
 * so the API route can turn failures into a clean 4xx/5xx response.
 */
export async function sendAssetEmail(
  input: SendAssetEmailInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isResendConfigured) {
    return {
      ok: false,
      error: "Email sending isn't connected yet (missing Resend config).",
    };
  }

  const resend = new Resend(RESEND_API_KEY);

  const subject = `${input.repName} sent you a file from ${SITE.name}`;

  const noteBlock = input.note
    ? `<p style="white-space:pre-wrap;margin:0 0 20px;color:#2b2b26;">${escapeHtml(
        input.note
      )}</p>`
    : "";

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#2b2b26;">
      <p style="margin:0 0 20px;">Hi${input.buyerName ? ` ${escapeHtml(input.buyerName)}` : ""},</p>
      ${noteBlock}
      <p style="margin:0 0 20px;">
        ${escapeHtml(input.repName)}${input.repCompany ? ` from ${escapeHtml(input.repCompany)}` : ""}
        sent you <strong>${escapeHtml(input.assetTitle)}</strong>
        ${input.assetDescription ? `&mdash; ${escapeHtml(input.assetDescription)}` : ""}.
      </p>
      <p style="margin:0 0 28px;">
        <a href="${input.downloadUrl}"
           style="display:inline-block;background:#2E6B44;color:#fff;text-decoration:none;
                  padding:12px 22px;border-radius:8px;font-weight:600;">
          Download ${escapeHtml(input.fileType)}
        </a>
      </p>
      <p style="margin:0 0 4px;font-size:13px;color:#8a8a7f;">
        This link expires in 7 days. Reply directly to this email to reach ${escapeHtml(input.repName)}.
      </p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: input.buyerEmail,
      replyTo: input.repEmail,
      subject,
      html,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to send email.",
    };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
