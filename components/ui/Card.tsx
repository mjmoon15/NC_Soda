import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/utils";

export function Card({
  pad = true,
  className,
  children,
  ...rest
}: ComponentProps<"div"> & { pad?: boolean; children: ReactNode }) {
  return (
    <div className={cx("card", pad && "card-pad", className)} {...rest}>
      {children}
    </div>
  );
}
