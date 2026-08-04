import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCatalog } from "./ProductCatalog";
import type { Product } from "@/lib/types";

// ProductCard pulls in next/link, which renders a plain anchor in jsdom — no
// mock required for this suite.

function make(
  id: string,
  name: string,
  category: Product["category"]
): Product {
  return {
    id,
    slug: id,
    name,
    tagline: `${name} tagline`,
    description: "desc",
    category,
    color: "#2E8B54",
    imageUrl: "",
    calories: 100,
    isGlutenFree: true,
    featured: false,
    sku: "X",
    upc: "Y",
    caseUpc: "Z",
    casePack: 12,
    unitVolume: "12 fl oz",
    netWeight: "9 lb",
    ingredients: "stuff",
    shelfLifeDays: 365,
  };
}

const products: Product[] = [
  make("soda-1", "Root 42", "Craft Soda"),
  make("soda-2", "Parakey", "Craft Soda"),
  make("hop-1", "Hopfin Citra", "Sparkling Hopwater"),
  make("marg-1", "Classic Lime", "Margarita Mix"),
];

describe("ProductCatalog", () => {
  // Product names render in both the CanArt label and the card heading, so we
  // assert against the heading role to target a single, unambiguous element.
  const heading = (name: string) =>
    screen.queryByRole("heading", { name });

  it("shows all products by default", () => {
    render(<ProductCatalog products={products} />);
    expect(heading("Root 42")).toBeInTheDocument();
    expect(heading("Hopfin Citra")).toBeInTheDocument();
    expect(heading("Classic Lime")).toBeInTheDocument();
  });

  it("renders a count badge for each tab", () => {
    render(<ProductCatalog products={products} />);
    const allTab = screen.getByRole("tab", { name: /All/ });
    expect(allTab).toHaveTextContent("4");
  });

  it("filters to a single category when a tab is clicked", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog products={products} />);

    await user.click(screen.getByRole("tab", { name: /Sparkling Hopwater/ }));

    expect(heading("Hopfin Citra")).toBeInTheDocument();
    expect(heading("Root 42")).not.toBeInTheDocument();
    expect(heading("Classic Lime")).not.toBeInTheDocument();
  });

  it("marks the active tab with aria-selected", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog products={products} />);

    const margTab = screen.getByRole("tab", { name: /Margarita Mix/ });
    await user.click(margTab);

    expect(margTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /All/ })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("returns to all products when All is reselected", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog products={products} />);

    await user.click(screen.getByRole("tab", { name: /Margarita Mix/ }));
    expect(heading("Root 42")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /All/ }));
    expect(heading("Root 42")).toBeInTheDocument();
    expect(heading("Hopfin Citra")).toBeInTheDocument();
  });

  it("shows an empty state when a category has no products", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog products={[make("s", "Solo Soda", "Craft Soda")]} />);

    await user.click(screen.getByRole("tab", { name: /Margarita Mix/ }));
    expect(screen.getByText(/No products in this category/i)).toBeInTheDocument();
  });
});
