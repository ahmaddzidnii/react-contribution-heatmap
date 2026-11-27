import type { MonthColumn } from "../types";

export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00`);
}

export function get52WeeksDateRange(endDate: Date = new Date()) {
  const start = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  start.setDate(start.getDate() - 52 * 7);

  while (start.getDay() !== 0) {
    start.setDate(start.getDate() - 1);
  }

  return {
    startDate: formatDateISO(start),
    endDate: formatDateISO(endDate),
  };
}

export function formatDateToOrdinalSuffix(dateString: string): string {
  const date = parseLocalDate(dateString);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${month} ${day}${suffix}`;
}

export interface CalendarCell {
  key: string;
  date: Date | null;
}

export function buildCalendarTable(
  startDate: Date,
  endDate: Date,
): {
  grid: CalendarCell[][];
  months: MonthColumn[];
} {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  const totalDays = Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1;
  const totalColumns = Math.max(1, Math.ceil((start.getDay() + totalDays) / 7));
  const startISO = formatDateISO(start);

  const grid: CalendarCell[][] = Array.from({ length: 7 }, (_, row) =>
    Array.from({ length: totalColumns }, (__, col) => ({
      key: `empty-${startISO}-w${col}-d${row}`,
      date: null,
    })),
  );

  const current = new Date(start);
  let week = 0;

  while (current <= end && week < totalColumns) {
    const dayOfWeek = current.getDay();
    const targetRow = grid[dayOfWeek];
    if (targetRow) {
      const dateCopy = new Date(current);
      targetRow[week] = {
        key: formatDateISO(dateCopy),
        date: dateCopy,
      };
    }

    current.setDate(current.getDate() + 1);
    if (current.getDay() === 0) {
      week++;
    }
  }

  const months: MonthColumn[] = [];
  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });

  for (let col = 0; col < totalColumns; col++) {
    let sampleDate: Date | null = null;
    for (let row = 0; row < 7; row++) {
      const cell = grid[row]?.[col]?.date;
      if (cell) {
        sampleDate = cell;
        break;
      }
    }

    if (!sampleDate) continue;

    const monthName = monthFormatter.format(sampleDate);
    const year = sampleDate.getFullYear();
    const lastMonth = months[months.length - 1];

    if (lastMonth && lastMonth.name === monthName && lastMonth.year === year) {
      lastMonth.colSpan += 1;
    } else {
      months.push({ name: monthName, year, colSpan: 1 });
    }
  }

  return { grid, months };
}
