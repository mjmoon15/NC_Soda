import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductForm, validateProduct, type ProductFormValues } from "./ProductForm";

const base: ProductFormValues = {
  name: "Parakey",
  category: "Craft Soda",
  sku: "NCS-CS-001",
  tagline: "Key lime pie in a can.",
  description: "",
  calories: "90",
  casePack: "12",
  unitVolume: "12 fl oz",
  featured: false,
};

describe("validateProduct", () => {
  it("passes a well-formed product", () => {
    expect(validateProduct(base)).toEqual({});
  });

  it("requires name, sku, and tagline", () => {
    const e = validateProduct({ ...base, name: "", sku: "", tagline: "" });
    expect(e.name).toBeTruthy();
    expect(e.sku).toBeTruthy();
    expect(e.tagline).toBeTruthy();
  });

  it("rejects a malformed SKU", () => {
    expect(validateProduct({ ...base, sku: "nope" }).sku).toBeTruthy();
  });

  it("rejects negative calories and non-integer case packs", () => {
    expect(validateProduct({ ...base, calories: "-5" }).calories).toBeTruthy();
    expect(validateProduct({ ...base, casePack: "1.5" }).casePack).toBeTruthy();
  });

  it("allows blank optional numeric fields", () => {
    const e = validateProduct({ ...base, calories: "", casePack: "" });
    expect(e.calories).toBeUndefined();
    expect(e.casePack).toBeUndefined();
  });
});

describe("ProductForm (demo-mode submit)", () => {
  it("shows inline errors and no demo notice on invalid submit", async () => {
    const user = userEvent.setup();
    render(<ProductForm />);
    await user.click(screen.getByRole("button", { name: /save product/i }));

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/sku is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/connect supabase/i)).not.toBeInTheDocument();
  });

  it("shows the demo-mode notice (does not persist) on a valid submit", async () => {
    const user = userEvent.setup();
    render(<ProductForm />);

    await user.type(screen.getByLabelText(/product name/i), "Parakey");
    await user.type(screen.getByLabelText(/^sku$/i), "NCS-CS-001");
    await user.type(screen.getByLabelText(/tagline/i), "Key lime pie.");
    await user.click(screen.getByRole("button", { name: /save product/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/connect supabase/i);
  });

  it("clears a field error once the user edits that field", async () => {
    const user = userEvent.setup();
    render(<ProductForm />);
    await user.click(screen.getByRole("button", { name: /save product/i }));
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/product name/i), "P");
    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
  });
});
