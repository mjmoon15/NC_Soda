import { DemoBanner } from "@/components/ui/DemoBanner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

/**
 * Chrome for every unauthenticated page: demo banner (only in demo mode),
 * sticky header, page content, and the footer pinned to the bottom.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <DemoBanner />
      <Header />
      <main style={{ flex: "1 0 auto" }}>{children}</main>
      <Footer />
    </div>
  );
}
