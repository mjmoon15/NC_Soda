import { Download } from "lucide-react";
import type { Product } from "@/lib/types";
import { computeCostMetrics, formatCost } from "@/lib/pricing";
import { SendPricingModal } from "./SendPricingModal";
import styles from "./PricingTable.module.css";

/**
 * Buyer-ready wholesale pricing table for /rep/pricing. Unlike the internal
 * ProductTable (UPC/shelf life/etc), this only shows what a buyer actually
 * cares about, plus per-SKU download/send actions.
 */
export function PricingTable({ products }: { products: Product[] }) {
  return (
    <div className={`card ${styles.tableCard}`} style={{ padding: 0 }}>
      <div className={styles.scroll}>
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Case Pack</th>
              <th>Unit Vol</th>
              <th>Case Cost</th>
              <th>Cost/Unit</th>
              <th>Cost/Oz</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const cost = computeCostMetrics(p);
              return (
                <tr key={p.id}>
                  <td className={styles.nameCell}>
                    <span className={styles.productCell}>
                      <span
                        className={styles.swatch}
                        style={{ background: p.color }}
                        aria-hidden
                      />
                      <strong>{p.name}</strong>
                    </span>
                  </td>
                  <td className="muted" data-label="Category">
                    {p.category}
                  </td>
                  <td data-label="Case Pack">{p.casePack || "—"}</td>
                  <td data-label="Unit Vol">{p.unitVolume || "—"}</td>
                  <td className={styles.mono} data-label="Case Cost">
                    {formatCost(cost.costPerCase)}
                  </td>
                  <td className={styles.mono} data-label="Cost/Unit">
                    {formatCost(cost.costPerUnit)}
                  </td>
                  <td className={styles.mono} data-label="Cost/Oz">
                    {formatCost(cost.costPerOz, 4)}
                  </td>
                  <td className={styles.actionsCell}>
                    <a
                      href={`/api/rep/pricing-sheet?slug=${encodeURIComponent(p.slug)}`}
                      className="btn btn-ghost btn-sm"
                      download
                    >
                      <Download size={15} />
                      PDF
                    </a>
                    <SendPricingModal slug={p.slug} title={p.name} compact />
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No products with cost data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
