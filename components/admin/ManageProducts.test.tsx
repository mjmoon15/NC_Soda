import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Product } from "@/lib/types";
import { ManageProducts } from "./ManageProducts";

function product(over: Partial<Product>): Product {
  return {
    id: "p_" + (over.slug ?? over.name ?? "x"),
    slug: over.slug ?? "slug",
    name: "Name",
    tagline: "tag",
    description: "",
    category: "Craft Soda",
    color: "#000",
    imageUrl: "",
    calories: 0,
    isGlutenFree: true,
    featured: false,
    sku: "NCS-CS-000",
    upc: "",
    caseUpc: "",
    casePack: 12,
    unitVolume: "12 fl oz",
    netWeight: "",
    ingredients: "",
    shelfLifeDays: 0,
    caseCost: null,
    ...over,
  };
}

const products: Product[] = [
  product({ name: "Zinger", sku: "NCS-CS-003", category: "Craft Soda" }),
  product({
    name: "Apple Fizz",
    sku: "NCS-MM-001",
    category: "Margarita Mix",
  }),
  product({
    name: "Mango Pop",
    sku: "NCS-HW-002",
    category: "Sparkling Hopwater",
  }),
];

function bodyRowNames(): string[] {
  const rows = screen.getAllByRole("row").slice(1); // drop header row
  return rows.map((r) => {
    const cell = within(r).getAllByRole("cell")[0];
    return cell.querySelector("strong")?.textContent ?? "";
  });
}

describe("ManageProducts", () => {
  it("renders all products sorted by name ascending by default", () => {
    render(<ManageProducts products={products} />);
    expect(bodyRowNames()).toEqual(["Apple Fizz", "Mango Pop", "Zinger"]);
  });

  it("filters by name, SKU, or category via the search box", async () => {
    const user = userEvent.setup();
    render(<ManageProducts products={products} />);
    const search = screen.getByLabelText(/search products/i);

    await user.type(search, "mango");
    expect(bodyRowNames()).toEqual(["Mango Pop"]);

    await user.clear(search);
    await user.type(search, "NCS-MM");
    expect(bodyRowNames()).toEqual(["Apple Fizz"]);

    await user.clear(search);
    await user.type(search, "hopwater");
    expect(bodyRowNames()).toEqual(["Mango Pop"]);
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<ManageProducts products={products} />);
    await user.type(screen.getByLabelText(/search products/i), "zzzz");
    expect(screen.getByText(/no products match/i)).toBeInTheDocument();
  });

  it("toggles sort direction when the Name header is clicked", async () => {
    const user = userEvent.setup();
    render(<ManageProducts products={products} />);
    await user.click(screen.getByRole("button", { name: /^name$/i }));
    expect(bodyRowNames()).toEqual(["Zinger", "Mango Pop", "Apple Fizz"]);
  });

  it("sorts by SKU when the SKU header is clicked", async () => {
    const user = userEvent.setup();
    render(<ManageProducts products={products} />);
    await user.click(screen.getByRole("button", { name: /^sku$/i }));
    // SKUs: NCS-CS-003 (Zinger), NCS-HW-002 (Mango), NCS-MM-001 (Apple)
    expect(bodyRowNames()).toEqual(["Zinger", "Mango Pop", "Apple Fizz"]);
  });

  it("reveals the new-product form when the button is clicked", async () => {
    const user = userEvent.setup();
    render(<ManageProducts products={products} />);
    expect(
      screen.queryByRole("button", { name: /save product/i })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /new product/i }));
    expect(
      screen.getByRole("button", { name: /save product/i })
    ).toBeInTheDocument();
  });
});
