import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssetForm, validateAsset, type AssetFormValues } from "./AssetForm";

const base: AssetFormValues = {
  title: "Parakey Sell Sheet",
  type: "sell_sheet",
  fileType: "PDF",
  sizeMb: "1.4",
  productSlug: "",
  description: "",
};

describe("validateAsset", () => {
  it("passes a valid asset", () => {
    expect(validateAsset(base)).toEqual({});
  });

  it("requires a title", () => {
    expect(validateAsset({ ...base, title: "" }).title).toBeTruthy();
  });

  it("requires a positive file size", () => {
    expect(validateAsset({ ...base, sizeMb: "" }).sizeMb).toBeTruthy();
    expect(validateAsset({ ...base, sizeMb: "0" }).sizeMb).toBeTruthy();
    expect(validateAsset({ ...base, sizeMb: "-3" }).sizeMb).toBeTruthy();
  });

  it("rejects sizes over the 500 MB limit", () => {
    expect(validateAsset({ ...base, sizeMb: "600" }).sizeMb).toBeTruthy();
  });
});

describe("AssetForm (demo-mode submit)", () => {
  it("blocks submit and shows errors when required fields are missing", async () => {
    const user = userEvent.setup();
    render(<AssetForm />);
    await user.click(screen.getByRole("button", { name: /upload asset/i }));

    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/file size is required/i)).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows the demo notice on a valid submit", async () => {
    const user = userEvent.setup();
    render(<AssetForm />);

    await user.type(screen.getByLabelText(/title/i), "Parakey Sell Sheet");
    await user.type(screen.getByLabelText(/file size/i), "1.4");
    await user.click(screen.getByRole("button", { name: /upload asset/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/connect supabase/i);
  });
});
