import { describe, expect, it } from "vitest";
import {
  buildCalendarTable,
  formatDateToOrdinalSuffix,
  get52WeeksDateRange,
  parseLocalDate,
} from "../src/utils/date-utils";

describe("date-utils", () => {
  it("always starts get52WeeksDateRange on a Sunday", () => {
    const { startDate } = get52WeeksDateRange(new Date("2026-11-27T00:00:00"));
    expect(parseLocalDate(startDate).getDay()).toBe(0);
  });

  it("formats ordinal suffixes accurately including teen exceptions", () => {
    expect(formatDateToOrdinalSuffix("2026-05-01")).toBe("May 1st");
    expect(formatDateToOrdinalSuffix("2026-05-02")).toBe("May 2nd");
    expect(formatDateToOrdinalSuffix("2026-05-03")).toBe("May 3rd");
    expect(formatDateToOrdinalSuffix("2026-05-11")).toBe("May 11th");
    expect(formatDateToOrdinalSuffix("2026-05-12")).toBe("May 12th");
    expect(formatDateToOrdinalSuffix("2026-05-13")).toBe("May 13th");
    expect(formatDateToOrdinalSuffix("2026-05-21")).toBe("May 21st");
  });

  it("builds 7 weekday rows and matches month colSpans to total columns", () => {
    const { grid, months } = buildCalendarTable(
      parseLocalDate("2026-01-01"),
      parseLocalDate("2026-03-31"),
    );

    expect(grid).toHaveLength(7);
    const totalCols = grid[0]?.length ?? 0;
    const sumColSpan = months.reduce((sum, m) => sum + m.colSpan, 0);
    expect(sumColSpan).toBe(totalCols);
  });
});
