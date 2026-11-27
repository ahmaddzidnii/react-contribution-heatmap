import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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

  it("maps levels using custom thresholds", () => {
    const { container } = render(
      <ContributionHeatmap
        startDate="2026-01-01"
        endDate="2026-01-07"
        thresholds={[15, 45, 90]}
        data={[
          { date: "2026-01-01", contributions: 10 },
          { date: "2026-01-02", contributions: 30 },
          { date: "2026-01-03", contributions: 60 },
          { date: "2026-01-04", contributions: 120 },
        ]}
      />,
    );

    expect(container.querySelector('[data-date="2026-01-01"]')?.getAttribute("data-level")).toBe(
      "1",
    );
    expect(container.querySelector('[data-date="2026-01-02"]')?.getAttribute("data-level")).toBe(
      "2",
    );
    expect(container.querySelector('[data-date="2026-01-03"]')?.getAttribute("data-level")).toBe(
      "3",
    );
    expect(container.querySelector('[data-date="2026-01-04"]')?.getAttribute("data-level")).toBe(
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

  it("calls onDayClick with date and summed contributions", () => {
    const handleDayClick = vi.fn();
    const { container } = render(
      <ContributionHeatmap
        startDate="2026-01-01"
        endDate="2026-01-07"
        data={[
          { date: "2026-01-04", contributions: 20 },
          { date: "2026-01-04", contributions: 25 },
        ]}
        onDayClick={handleDayClick}
      />,
    );

    const cell = container.querySelector('[data-date="2026-01-04"]') as HTMLElement;
    expect(cell).toBeTruthy();

    fireEvent.click(cell);
    expect(handleDayClick).toHaveBeenCalledTimes(1);
    expect(handleDayClick).toHaveBeenCalledWith({
      date: "2026-01-04",
      contributions: 45,
    });
  });

  it("applies custom colors via CSS variables and customizes legend", () => {
    const { container, rerender } = render(
      <ContributionHeatmap
        startDate="2026-01-01"
        endDate="2026-01-07"
        colors={["#111111", "#222222", "#333333", "#444444", "#555555"]}
        legendText="Custom legend"
        legendLabels={["Min", "Max"]}
      />,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--rch-color-4")).toBe("#555555");
    expect(screen.getByText("Custom legend")).toBeTruthy();
    expect(screen.getByText("Min")).toBeTruthy();
    expect(screen.getByText("Max")).toBeTruthy();

    rerender(
      <ContributionHeatmap startDate="2026-01-01" endDate="2026-01-07" showLegend={false} />,
    );
    expect(screen.queryByText("Custom legend")).toBeNull();
  });
});
