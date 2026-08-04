import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

type Tone = "brand" | "coral" | "citrus" | "neutral";

const TONE: Record<Tone, string> = {
  brand: "badge-brand",
  coral: "badge-coral",
  citrus: "badge-citrus",
  neutral: "badge-neutral",
};

export function Badge({
  tone = "brand",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return <span className={cx("badge", TONE[tone], className)}>{children}</span>;
}
