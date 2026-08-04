import Link from "next/link";
import { Sparkles } from "lucide-react";
import { SITE } from "@/lib/config";
import styles from "./Footer.module.css";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Drink",
    links: [
      { href: "/products", label: "All sodas" },
      { href: "/products/parakey-key-lime-pie", label: "Parakey" },
      { href: "/products/hopfin-citra-hopwater", label: "Hopfin Hopwater" },
      { href: "/products/margarita-mix-classic-lime", label: "Margarita Mix" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/videos", label: "Videos" },
    ],
  },
  {
    title: "Partners",
    links: [
      { href: "/login", label: "Partner sign in" },
      { href: "/login", label: "Request access" },
    ],
  },
];

/** Public-site footer: brand blurb, nav columns, and small print. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandDot}>
              <Sparkles size={16} />
            </span>
            {SITE.shortName}
          </Link>
          <p className={styles.blurb}>{SITE.tagline}</p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} className={styles.col} aria-label={col.title}>
            <span className={styles.colTitle}>{col.title}</span>
            {col.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={styles.colLink}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>
          © {year} {SITE.name}
        </span>
        <span className="muted">Real ingredients. Joyful fizz.</span>
      </div>
    </footer>
  );
}
