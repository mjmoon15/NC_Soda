import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RepSearch, searchItems, type SearchItem } from "./RepSearch";

const items: SearchItem[] = [
  {
    id: "p1",
    kind: "product",
    title: "Parakey",
    subtitle: "Craft Soda",
    detail: "Key lime pie in a can",
    href: "/rep/products",
    keywords: ["Parakey", "NCS-CS-001", "860000000017", "Craft Soda"],
  },
  {
    id: "a1",
    kind: "asset",
    title: "Parakey Sell Sheet",
    subtitle: "PDF",
    detail: "One-pager with specs",
    href: "/rep/sell-sheets",
    keywords: ["Parakey Sell Sheet", "sell_sheet", "PDF"],
  },
  {
    id: "v1",
    kind: "training",
    title: "The 90-Second Buyer Pitch",
    subtitle: "Training",
    detail: "Land a new account",
    href: "/rep/training",
    keywords: ["The 90-Second Buyer Pitch", "training"],
  },
];

describe("searchItems", () => {
  it("returns all items for an empty query", () => {
    expect(searchItems(items, "")).toHaveLength(3);
    expect(searchItems(items, "   ")).toHaveLength(3);
  });

  it("matches across title and keywords, case-insensitively", () => {
    const r = searchItems(items, "parakey");
    expect(r.map((i) => i.id).sort()).toEqual(["a1", "p1"]);
  });

  it("matches a product by SKU keyword", () => {
    expect(searchItems(items, "ncs-cs-001").map((i) => i.id)).toEqual(["p1"]);
  });

  it("requires every whitespace token to match (AND semantics)", () => {
    expect(searchItems(items, "buyer pitch").map((i) => i.id)).toEqual(["v1"]);
    expect(searchItems(items, "buyer parakey")).toHaveLength(0);
  });

  it("returns nothing on no match", () => {
    expect(searchItems(items, "zzz")).toHaveLength(0);
  });
});

describe("<RepSearch /> interactions", () => {
  it("renders all items grouped before any query", () => {
    render(<RepSearch items={items} />);
    expect(screen.getByText("Parakey")).toBeInTheDocument();
    expect(screen.getByText("Parakey Sell Sheet")).toBeInTheDocument();
    expect(screen.getByText("The 90-Second Buyer Pitch")).toBeInTheDocument();
  });

  it("filters across groups live and shows a result count", async () => {
    const user = userEvent.setup();
    render(<RepSearch items={items} />);
    await user.type(
      screen.getByLabelText("Search the rep portal"),
      "parakey"
    );
    expect(screen.getByText("Parakey")).toBeInTheDocument();
    expect(screen.getByText("Parakey Sell Sheet")).toBeInTheDocument();
    expect(
      screen.queryByText("The 90-Second Buyer Pitch")
    ).not.toBeInTheDocument();
    expect(screen.getByText(/2 results/)).toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<RepSearch items={items} />);
    await user.type(
      screen.getByLabelText("Search the rep portal"),
      "zzzzz"
    );
    expect(screen.getByText(/No results/)).toBeInTheDocument();
  });
});
