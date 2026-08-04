"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/utils";
import styles from "./PortalShell.module.css";

/** Sidebar link that highlights when it matches the current route. */
export function NavLink({
  href,
  label,
  exact,
  children,
}: {
  href: string;
  label: string;
  exact?: boolean;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cx(styles.link, active && styles.linkActive)}
      aria-current={active ? "page" : undefined}
    >
      {children}
      <span>{label}</span>
    </Link>
  );
}
