import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContributionHeatmap } from "../src";

describe("ContributionHeatmap", () => {
  it("throws if only one of startDate or endDate is provided", () => {
    expect(() => render(<ContributionHeatmap startDate="2026-01-01" />)).toThrow(
      "Both startDate and endDate must be provided together.",
    );
  });

  it("calculates contribution levels and aggregates duplicate dates", () => {
    const { container } = render(
      <ContributionHeatmap
        startDate="2026-01-01"
        endDate="2026-01-07"
        data={[
          { date: "2026-01-01", contributions: 0 },
          { date: "2026-01-02", contributions: 2 },
          { date: "2026-01-03", contributions: 5 },
          { date: "2026-01-03", contributions: 5 }, // total 10 (max -> level 4)
        ]}
      />,
    );

    expect(container.querySelector('[data-date="2026-01-01"]')?.getAttribute("data-level")).toBe(
      "0",
    );
    expect(container.querySelector('[data-date="2026-01-02"]')?.getAttribute("data-level")).toBe(
      "1",
    );
    expect(container.querySelector('[data-date="2026-01-03"]')?.getAttribute("data-level")).toBe(
      "4",
    );
  });

  it("shows and hides tooltip on hover and focus", () => {
    const { container } = render(
      <ContributionHeatmap
        startDate="2026-01-01"
        endDate="2026-01-07"
        data={[{ date: "2026-01-05", contributions: 7 }]}
      />,
    );

    const cell = container.querySelector('[data-date="2026-01-05"]') as HTMLElement;
    expect(cell).toBeTruthy();

    fireEvent.mouseEnter(cell);
    expect(screen.getByRole("tooltip").textContent).toBe("7 contributions on January 5th");

    fireEvent.mouseLeave(cell);
    expect(screen.queryByRole("tooltip")).toBeNull();

    fireEvent.focus(cell);
    expect(screen.getByRole("tooltip").textContent).toBe("7 contributions on January 5th");
  });

  it("applies custom colors via CSS variables and toggles legend", () => {
    const { container, rerender } = render(
      <ContributionHeatmap
        startDate="2026-01-01"
        endDate="2026-01-07"
        colors={["#111111", "#222222", "#333333", "#444444", "#555555"]}
        legendText="Custom legend"
      />,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--rch-color-4")).toBe("#555555");
    expect(screen.getByText("Custom legend")).toBeTruthy();

    rerender(
      <ContributionHeatmap startDate="2026-01-01" endDate="2026-01-07" showLegend={false} />,
    );
    expect(screen.queryByText("Custom legend")).toBeNull();
  });
});
