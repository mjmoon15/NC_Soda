import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanArt } from "./CanArt";

describe("CanArt", () => {
  it("renders the product name", () => {
    render(
      <CanArt
        product={{ name: "Parakey", color: "#7FC397", category: "Craft Soda" }}
      />
    );
    expect(screen.getByText("Parakey")).toBeInTheDocument();
  });

  it("labels hopwater products as Hopwater", () => {
    render(
      <CanArt
        product={{
          name: "Hopfin",
          color: "#4FA66F",
          category: "Sparkling Hopwater",
        }}
      />
    );
    expect(screen.getByText("Hopwater")).toBeInTheDocument();
  });

  it("labels margarita mixes as Mixer", () => {
    render(
      <CanArt
        product={{
          name: "Classic Lime",
          color: "#F6B53F",
          category: "Margarita Mix",
        }}
      />
    );
    expect(screen.getByText("Mixer")).toBeInTheDocument();
  });
});
