import { createElement } from "react";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getSessionUser, hasAccess } from "@/lib/auth/session";
import { getRepProducts } from "@/lib/data";
import { PricingLineSheet, PricingSkuSheet, type RepInfo } from "@/lib/pdf/PricingSheet";
import { sendPricingSheetEmail } from "@/lib/email/resend";
import { isResendConfigured } from "@/lib/config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/rep/send-pricing
 * Body: { slug?: string, buyerEmail: string, buyerName?: string, note?: string }
 *
 * Rep/admin-only. Renders a wholesale pricing PDF (full line, or one SKU
 * when `slug` is given) and emails it to the buyer as an attachment via
 * Resend, with the signed-in rep as replyTo.
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

  const { slug, buyerEmail, buyerName, note } = (body ?? {}) as Record<string, unknown>;

  if (typeof buyerEmail !== "string" || !EMAIL_RE.test(buyerEmail)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const products = await getRepProducts();
  const rep: RepInfo = {
    name: user!.fullName,
    email: user!.email,
    company: user!.company,
  };

  let element: React.ReactElement;
  let title: string;
  let filename: string;

  if (typeof slug === "string" && slug) {
    const product = products.find((p) => p.slug === slug);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    element = createElement(PricingSkuSheet, { product, rep });
    title = product.name;
    filename = `${slugify(product.name)}-pricing.pdf`;
  } else {
    element = createElement(PricingLineSheet, { products, rep });
    title = "the full price list";
    filename = "new-creation-price-list.pdf";
  }

  const pdfBuffer = await renderToBuffer(
    element as Parameters<typeof renderToBuffer>[0]
  );

  const result = await sendPricingSheetEmail({
    buyerEmail,
    buyerName: typeof buyerName === "string" ? buyerName : undefined,
    repName: rep.name,
    repEmail: rep.email!,
    repCompany: rep.company,
    title,
    note: typeof note === "string" ? note.slice(0, 2000) : undefined,
    pdfBuffer,
    pdfFilename: filename,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
