import { redirect } from "next/navigation";
import {
  Boxes,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Search,
} from "lucide-react";
import { PortalShell, type NavItem } from "@/components/portal/PortalShell";
import { getSessionUser, hasAccess } from "@/lib/auth/session";

const REP_NAV: NavItem[] = [
  { href: "/rep", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/rep/products", label: "Product Data", icon: Boxes },
  { href: "/rep/sell-sheets", label: "Sell Sheets & POS", icon: FileText },
  { href: "/rep/training", label: "Training", icon: GraduationCap },
  { href: "/rep/search", label: "Search", icon: Search },
];

export default async function RepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!hasAccess(user, "rep")) redirect("/login");

  return (
    <PortalShell
      user={user!}
      navTitle="Rep Portal"
      topbarTitle="Rep Portal"
      nav={REP_NAV}
    >
      {children}
    </PortalShell>
  );
}
