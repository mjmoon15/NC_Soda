import { redirect } from "next/navigation";
import {
  Boxes,
  Clapperboard,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { PortalShell, type NavItem } from "@/components/portal/PortalShell";
import { getSessionUser, hasAccess } from "@/lib/auth/session";

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/videos", label: "Videos", icon: Clapperboard },
  { href: "/admin/assets", label: "Assets", icon: FileText },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user || !hasAccess(user, "admin")) redirect("/login");

  return (
    <PortalShell
      user={user}
      navTitle="Admin"
      nav={ADMIN_NAV}
      topbarTitle="Content Admin"
    >
      {children}
    </PortalShell>
  );
}
