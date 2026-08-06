import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { LogOut, Sparkles } from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import type { SessionUser } from "@/lib/types";
import { NavLink } from "./NavLink";
import styles from "./PortalShell.module.css";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

/**
 * Shared chrome for the rep + admin portals: branded sidebar, role-aware nav,
 * signed-in user block, and a sign-out action. Pages render their own heading
 * inside `children`.
 */
function UserBlock({
  user,
  className,
}: {
  user: SessionUser;
  className: string;
}) {
  return (
    <div className={className}>
      <div className={styles.userName}>{user.fullName}</div>
      <div className={styles.userMeta}>
        {user.company ?? user.email}
        {user.isDemo ? " · demo" : ""}
      </div>
      <form action={signOut}>
        <button type="submit" className="btn btn-outline btn-sm btn-block">
          <LogOut size={15} />
          Sign out
        </button>
      </form>
    </div>
  );
}

export function PortalShell({
  user,
  navTitle,
  nav,
  topbarTitle,
  children,
}: {
  user: SessionUser;
  navTitle: string;
  nav: NavItem[];
  topbarTitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href={nav[0]?.href ?? "/login"} className={styles.brand}>
          <span className={styles.brandDot}>
            <Sparkles size={15} />
          </span>
          New Creation
        </Link>

        <span className={styles.navLabel}>{navTitle}</span>
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              exact={item.exact}
            >
              <Icon size={18} />
            </NavLink>
          );
        })}

        <div className={styles.spacer} />

        <UserBlock user={user} className={styles.user} />
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <h1 className={styles.topTitle}>{topbarTitle}</h1>
        </header>
        <div className={styles.content}>{children}</div>
        <UserBlock user={user} className={styles.userMobile} />
      </div>
    </div>
  );
}
