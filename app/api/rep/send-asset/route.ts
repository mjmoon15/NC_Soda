import { NextResponse } from "next/server";
import { getAssetForSend } from "@/lib/data";
import { getSessionUser, hasAccess } from "@/lib/auth/session";
import { sendAssetEmail } from "@/lib/email/resend";
import { isResendConfigured } from "@/lib/config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/rep/send-asset
 * Body: { assetId: string, buyerEmail: string, buyerName?: string, note?: string }
 *
 * Rep/admin-only. Mints a 7-day signed download link for the asset and
 * emails it to the buyer via Resend, with the signed-in rep as replyTo.
 */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!hasAccess(user, "rep")) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (!isResendConfigured) {
    return NextResponse.json(
      { error: "Email sending isn't connected yet. Ask an admin to set up Resend." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { assetId, buyerEmail, buyerName, note } = (body ?? {}) as Record<string, unknown>;

  if (typeof assetId !== "string" || !assetId) {
    return NextResponse.json({ error: "Missing assetId." }, { status: 400 });
  }
  if (typeof buyerEmail !== "string" || !EMAIL_RE.test(buyerEmail)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const asset = await getAssetForSend(assetId);
  if (!asset) {
    return NextResponse.json({ error: "Asset not found." }, { status: 404 });
  }
  if (!asset.downloadUrl || asset.downloadUrl.startsWith("#")) {
    return NextResponse.json(
      { error: "This file isn't available to send yet." },
      { status: 422 }
    );
  }

  const result = await sendAssetEmail({
    buyerEmail,
    buyerName: typeof buyerName === "string" ? buyerName : undefined,
    repName: user!.fullName,
    repEmail: user!.email,
    repCompany: user!.company,
    assetTitle: asset.title,
    assetDescription: asset.description,
    fileType: asset.fileType,
    downloadUrl: asset.downloadUrl,
    note: typeof note === "string" ? note.slice(0, 2000) : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
