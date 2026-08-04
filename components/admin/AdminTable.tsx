import type { ReactNode } from "react";
import { cx } from "@/lib/utils";
import styles from "./AdminTable.module.css";

export interface Column<T> {
  /** Stable key, also used for the header cell. */
  key: string;
  header: string;
  /** Cell renderer for a given row. */
  cell: (row: T) => ReactNode;
  /** Right-align (used for the trailing actions column). */
  align?: "left" | "right";
}

/**
 * Generic management table shared by the admin product / video / asset views.
 * Pure presentational shell — sorting/filtering live in the page-level client
 * components that own state, this just renders rows + an empty state.
 */
export function AdminTable<T>({
  columns,
  rows,
  rowKey,
  emptyLabel = "Nothing here yet.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyLabel?: string;
}) {
  return (
    <div className={cx("card", styles.wrap)}>
      <table className={cx("table", styles.table)}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.align === "right" ? styles.actionsCol : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className={styles.empty}>{emptyLabel}</div>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={
                      col.align === "right" ? styles.actionsCol : undefined
                    }
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
