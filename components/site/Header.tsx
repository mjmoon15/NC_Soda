"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/utils";
import styles from "./Header.module.css";

const NAV = [
  { href: "/", label: "Home", exact: true },
  { href: "/products", label: "Sodas" },
  { href: "/videos", label: "Videos" },
  { href: "/about", label: "About" },
] as const;

/**
 * Sticky public header: brand mark, primary nav, and a partner sign-in CTA.
 * Client component so the mobile menu toggle and active-link highlight work.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <header className={styles.header}>
      <div className={cx("container", styles.bar)}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.brandDot}>
            <Sparkles size={16} />
          </span>
          New Creation
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                styles.navLink,
                isActive(item.href, "exact" in item ? item.exact : undefined) &&
                  styles.navLinkActive
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Button href="/login" size="sm">
            Partner sign in
          </Button>
        </div>

        <button
          type="button"
          className={styles.menuBtn}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className={styles.mobilePanel}>
          <nav className={styles.mobileNav} aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  styles.mobileLink,
                  isActive(
                    item.href,
                    "exact" in item ? item.exact : undefined
                  ) && styles.navLinkActive
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button href="/login" block onClick={() => setOpen(false)}>
              Partner sign in
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
