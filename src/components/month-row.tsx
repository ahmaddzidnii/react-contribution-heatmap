import type { MonthColumn } from "../types";

interface MonthRowProps {
  months: MonthColumn[];
}

export function MonthRow({ months }: MonthRowProps) {
  return (
    <thead>
      <tr className="rch__months-row">
        <td className="rch__day-label-spacer">
          <span className="rch__sr-only">Day of Week</span>
        </td>
        {months.map((month) => (
          <td key={`${month.name}-${month.year}`} colSpan={month.colSpan} className="rch__month">
            <span className="rch__sr-only">{month.name}</span>
            <span aria-hidden="true">{month.name.slice(0, 3)}</span>
          </td>
        ))}
      </tr>
    </thead>
  );
}
