import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a <button> by default with the primary variant", () => {
    render(<Button>Click</Button>);
    const btn = screen.getByRole("button", { name: "Click" });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain("btn");
    expect(btn.className).toContain("btn-primary");
  });

  it("applies variant and size classes", () => {
    render(
      <Button variant="coral" size="lg">
        Buy
      </Button>
    );
    const btn = screen.getByRole("button", { name: "Buy" });
    expect(btn.className).toContain("btn-coral");
    expect(btn.className).toContain("btn-lg");
  });

  it("renders an anchor when href is provided", () => {
    render(<Button href="/products">Shop</Button>);
    const link = screen.getByRole("link", { name: "Shop" });
    expect(link).toHaveAttribute("href", "/products");
    expect(link.className).toContain("btn");
  });
});
