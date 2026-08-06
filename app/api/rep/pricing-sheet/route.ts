import { createElement } from "react";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getSessionUser, hasAccess } from "@/lib/auth/session";
import { getRepProducts } from "@/lib/data";
import { PricingLineSheet, PricingSkuSheet, type RepInfo } from "@/lib/pdf/PricingSheet";

/**
 * GET /api/rep/pricing-sheet[?slug=<product-slug>]
 *
 * Rep/admin-only. Renders a wholesale pricing PDF on demand — the full
 * price list, or a single-SKU one-pager when `slug` is given. Downloaded
 * directly via a plain `<a href>` link; no client JS required.
 */
export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!hasAccess(user, "rep")) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const products = await getRepProducts();
  const rep: RepInfo = {
    name: user!.fullName,
    email: user!.email,
    company: user!.company,
  };

  let element: React.ReactElement;
  let filename: string;

  if (slug) {
    const product = products.find((p) => p.slug === slug);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    element = createElement(PricingSkuSheet, { product, rep });
    filename = `${slugify(product.name)}-pricing.pdf`;
  } else {
    element = createElement(PricingLineSheet, { products, rep });
    filename = "new-creation-price-list.pdf";
  }

  const buffer = await renderToBuffer(
    element as Parameters<typeof renderToBuffer>[0]
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
