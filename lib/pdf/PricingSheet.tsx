/**
 * Buyer-facing wholesale pricing PDFs. Rendered server-side (route handlers
 * under app/api/rep) via @react-pdf/renderer — no headless browser, works
 * fine in a serverless function. Two flavors: the full-line summary table
 * and a single-SKU one-pager, both sharing the same header/footer chrome.
 */
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Product } from "@/lib/types";
import { computeCostMetrics, formatCost } from "@/lib/pricing";

const BRAND = "#2E8B54";
const BRAND_DARK = "#195838";
const INK = "#16271C";
const MUTED = "#6B7A72";
const LINE = "#E3DFD3";

export interface RepInfo {
  name: string;
  email?: string;
  company?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    color: INK,
    fontFamily: "Helvetica",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 26,
    paddingBottom: 16,
    borderBottom: `2px solid ${BRAND}`,
  },
  eyebrow: {
    fontSize: 8,
    color: MUTED,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  brand: {
    fontSize: 16,
    fontWeight: 700,
    color: BRAND_DARK,
  },
  metaRight: {
    alignItems: "flex-end",
  },
  metaText: {
    fontSize: 9,
    color: MUTED,
    marginBottom: 2,
  },
  table: {
    width: "100%",
  },
  th: {
    flexDirection: "row",
    borderBottom: `1.5px solid ${INK}`,
    paddingBottom: 6,
    marginBottom: 2,
  },
  tr: {
    flexDirection: "row",
    borderBottom: `1px solid ${LINE}`,
    paddingVertical: 8,
    alignItems: "center",
  },
  thText: {
    fontSize: 8,
    fontWeight: 700,
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cellProduct: { width: "26%" },
  cellCategory: { width: "18%" },
  cellCasePack: { width: "10%" },
  cellUnitVol: { width: "12%" },
  cellCaseCost: { width: "12%" },
  cellCostUnit: { width: "11%" },
  cellCostOz: { width: "11%" },
  productName: { fontSize: 10, fontWeight: 700 },
  footer: {
    marginTop: 26,
    paddingTop: 12,
    borderTop: `1px solid ${LINE}`,
    fontSize: 8,
    color: MUTED,
    lineHeight: 1.5,
  },
  skuTitle: { fontSize: 24, fontWeight: 700, color: INK, marginBottom: 4 },
  skuCategory: {
    fontSize: 9,
    color: BRAND_DARK,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: 700,
    marginBottom: 10,
  },
  skuTagline: { fontSize: 12, color: MUTED, marginBottom: 28 },
  specGrid: { flexDirection: "row", flexWrap: "wrap" },
  specBox: {
    width: "33%",
    marginBottom: 22,
    paddingRight: 12,
  },
  specLabel: {
    fontSize: 8,
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  specValue: { fontSize: 15, fontWeight: 700, color: INK },
});

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Header({ rep }: { rep?: RepInfo }) {
  return (
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.eyebrow}>Wholesale Pricing</Text>
        <Text style={styles.brand}>New Creation Soda Works</Text>
      </View>
      <View style={styles.metaRight}>
        <Text style={styles.metaText}>{formatDate()}</Text>
        {rep ? (
          <Text style={styles.metaText}>
            {rep.name}
            {rep.company ? ` · ${rep.company}` : ""}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function Footer({ rep }: { rep?: RepInfo }) {
  return (
    <View style={styles.footer}>
      <Text>
        Costs shown reflect wholesale case price to distributor and are
        subject to change. Contact your rep for current terms.
        {rep ? ` ${rep.name}${rep.email ? ` · ${rep.email}` : ""}` : ""}
      </Text>
    </View>
  );
}

/** Full price list — every SKU, one row each. */
export function PricingLineSheet({
  products,
  rep,
}: {
  products: Product[];
  rep?: RepInfo;
}) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Header rep={rep} />
        <View style={styles.table}>
          <View style={styles.th}>
            <Text style={{ ...styles.thText, ...styles.cellProduct }}>Product</Text>
            <Text style={{ ...styles.thText, ...styles.cellCategory }}>Category</Text>
            <Text style={{ ...styles.thText, ...styles.cellCasePack }}>Pack</Text>
            <Text style={{ ...styles.thText, ...styles.cellUnitVol }}>Unit Vol</Text>
            <Text style={{ ...styles.thText, ...styles.cellCaseCost }}>Case Cost</Text>
            <Text style={{ ...styles.thText, ...styles.cellCostUnit }}>Cost/Unit</Text>
            <Text style={{ ...styles.thText, ...styles.cellCostOz }}>Cost/Oz</Text>
          </View>
          {products.map((p) => {
            const cost = computeCostMetrics(p);
            return (
              <View key={p.id} style={styles.tr} wrap={false}>
                <Text style={{ ...styles.productName, ...styles.cellProduct }}>
                  {p.name}
                </Text>
                <Text style={styles.cellCategory}>{p.category}</Text>
                <Text style={styles.cellCasePack}>{p.casePack || "—"}</Text>
                <Text style={styles.cellUnitVol}>{p.unitVolume || "—"}</Text>
                <Text style={styles.cellCaseCost}>{formatCost(cost.costPerCase)}</Text>
                <Text style={styles.cellCostUnit}>{formatCost(cost.costPerUnit)}</Text>
                <Text style={styles.cellCostOz}>{formatCost(cost.costPerOz, 4)}</Text>
              </View>
            );
          })}
        </View>
        <Footer rep={rep} />
      </Page>
    </Document>
  );
}

function SpecBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.specBox}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

/** Single-SKU one-pager. */
export function PricingSkuSheet({
  product,
  rep,
}: {
  product: Product;
  rep?: RepInfo;
}) {
  const cost = computeCostMetrics(product);
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Header rep={rep} />
        <Text style={styles.skuCategory}>{product.category}</Text>
        <Text style={styles.skuTitle}>{product.name}</Text>
        {product.tagline ? (
          <Text style={styles.skuTagline}>{product.tagline}</Text>
        ) : null}
        <View style={styles.specGrid}>
          <SpecBox
            label="Case Pack"
            value={product.casePack ? `${product.casePack} units` : "—"}
          />
          <SpecBox label="Unit Volume" value={product.unitVolume || "—"} />
          <SpecBox label="Shelf Life" value={`${product.shelfLifeDays} days`} />
          <SpecBox label="Case Cost" value={formatCost(cost.costPerCase)} />
          <SpecBox label="Cost / Unit" value={formatCost(cost.costPerUnit)} />
          <SpecBox label="Cost / Oz" value={formatCost(cost.costPerOz, 4)} />
        </View>
        <Footer rep={rep} />
      </Page>
    </Document>
  );
}
