import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// usePathname drives active-link highlighting; mock it per test.
const pathname = vi.fn(() => "/");
vi.mock("next/navigation", () => ({
  usePathname: () => pathname(),
}));

import { Header } from "./Header";
import styles from "./Header.module.css";

describe("Header", () => {
  beforeEach(() => {
    pathname.mockReturnValue("/");
  });

  it("renders the primary nav links", () => {
    render(<Header />);
    // Home, Sodas, Videos, About appear in the desktop nav.
    expect(screen.getByRole("link", { name: "Sodas" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Videos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("links the partner CTA to /login", () => {
    render(<Header />);
    const cta = screen.getAllByRole("link", { name: /Partner sign in/i })[0];
    expect(cta).toHaveAttribute("href", "/login");
  });

  it("marks Sodas active on a /products route", () => {
    pathname.mockReturnValue("/products/parakey-key-lime-pie");
    render(<Header />);
    const sodas = screen.getByRole("link", { name: "Sodas" });
    expect(sodas.className).toContain(styles.navLinkActive);
  });

  it("does not mark Home active on a non-home route (exact match)", () => {
    pathname.mockReturnValue("/products");
    render(<Header />);
    const home = screen.getByRole("link", { name: "Home" });
    expect(home.className).not.toContain(styles.navLinkActive);
  });

  it("toggles the mobile menu open and closed", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    // Mobile nav not present until opened.
    expect(screen.queryByLabelText("Mobile")).not.toBeInTheDocument();

    await user.click(toggle);
    expect(screen.getByLabelText("Mobile")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /close menu/i })
    ).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: /close menu/i }));
    expect(screen.queryByLabelText("Mobile")).not.toBeInTheDocument();
  });
});
