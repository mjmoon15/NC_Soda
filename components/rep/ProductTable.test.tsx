import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Product } from "@/lib/types";
import { ProductTable, filterProducts, sortProducts } from "./ProductTable";

const base: Omit<Product, "id" | "name" | "category" | "sku" | "upc"> = {
  slug: "x",
  tagline: "",
  description: "",
  color: "#000",
  imageUrl: "",
  calories: 0,
  isGlutenFree: true,
  featured: false,
  caseUpc: "",
  casePack: 12,
  unitVolume: "12 fl oz",
  netWeight: "9 lb",
  ingredients: "",
  shelfLifeDays: 365,
};

const products: Product[] = [
  {
    ...base,
    id: "1",
    name: "Parakey",
    category: "Craft Soda",
    sku: "NCS-CS-001",
    upc: "860000000017",
    caseUpc: "10860000000014",
    casePack: 12,
    shelfLifeDays: 365,
  },
  {
    ...base,
    id: "2",
    name: "Hopfin Citra",
    category: "Sparkling Hopwater",
    sku: "NCS-HW-001",
    upc: "860000000031",
    caseUpc: "10860000000038",
    casePack: 24,
    shelfLifeDays: 270,
  },
  {
    ...base,
    id: "3",
    name: "Classic Lime Mix",
    category: "Margarita Mix",
    sku: "NCS-MM-001",
    upc: "860000000055",
    caseUpc: "10860000000052",
    casePack: 6,
    shelfLifeDays: 540,
  },
];

describe("filterProducts", () => {
  it("returns all products for an empty query", () => {
    expect(filterProducts(products, "")).toHaveLength(3);
    expect(filterProducts(products, "   ")).toHaveLength(3);
  });

  it("matches by name, case-insensitively", () => {
    const r = filterProducts(products, "parakey");
    expect(r.map((p) => p.id)).toEqual(["1"]);
  });

  it("matches by SKU", () => {
    expect(filterProducts(products, "NCS-HW")).toHaveLength(1);
    expect(filterProducts(products, "ncs-hw")[0].id).toBe("2");
  });

  it("matches by UPC and case UPC", () => {
    expect(filterProducts(products, "860000000055")[0].id).toBe("3");
    expect(filterProducts(products, "10860000000038")[0].id).toBe("2");
  });

  it("returns nothing on no match", () => {
    expect(filterProducts(products, "zzz")).toHaveLength(0);
  });
});

describe("sortProducts", () => {
  it("sorts strings ascending and descending", () => {
    expect(sortProducts(products, "name", "asc").map((p) => p.name)).toEqual([
      "Classic Lime Mix",
      "Hopfin Citra",
      "Parakey",
    ]);
    expect(sortProducts(products, "name", "desc").map((p) => p.name)).toEqual([
      "Parakey",
      "Hopfin Citra",
      "Classic Lime Mix",
    ]);
  });

  it("sorts numeric columns numerically", () => {
    expect(
      sortProducts(products, "casePack", "asc").map((p) => p.casePack)
    ).toEqual([6, 12, 24]);
    expect(
      sortProducts(products, "shelfLifeDays", "desc").map((p) => p.shelfLifeDays)
    ).toEqual([540, 365, 270]);
  });

  it("does not mutate the input array", () => {
    const before = products.map((p) => p.id);
    sortProducts(products, "casePack", "desc");
    expect(products.map((p) => p.id)).toEqual(before);
  });
});

describe("<ProductTable /> interactions", () => {
  it("filters rows live as the user types", async () => {
    const user = userEvent.setup();
    render(<ProductTable products={products} />);
    expect(screen.getAllByRole("row")).toHaveLength(4); // header + 3

    await user.type(
      screen.getByLabelText("Search products"),
      "hopfin"
    );
    expect(screen.getByText("Hopfin Citra")).toBeInTheDocument();
    expect(screen.queryByText("Parakey")).not.toBeInTheDocument();
  });

  it("narrows rows with the category filter", async () => {
    const user = userEvent.setup();
    render(<ProductTable products={products} />);
    await user.selectOptions(
      screen.getByLabelText("Filter by category"),
      "Margarita Mix"
    );
    expect(screen.getByText("Classic Lime Mix")).toBeInTheDocument();
    expect(screen.queryByText("Parakey")).not.toBeInTheDocument();
    expect(screen.getByText("1 product")).toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<ProductTable products={products} />);
    await user.type(screen.getByLabelText("Search products"), "zzzzz");
    expect(screen.getByText(/No products match/)).toBeInTheDocument();
  });

  it("sorts by case pack when its header is clicked", async () => {
    const user = userEvent.setup();
    render(<ProductTable products={products} />);
    await user.click(screen.getByRole("button", { name: /Case Pack/ }));
    const firstDataRow = screen.getAllByRole("row")[1];
    expect(firstDataRow).toHaveTextContent("Classic Lime Mix"); // casePack 6 first
  });
});
