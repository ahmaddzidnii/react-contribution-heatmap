import { type CSSProperties, useMemo, useState } from "react";
import { DAY_LABELS, LEVELS } from "../constants";
import type { ContributionHeatmapProps } from "../types";
import {
  buildCalendarTable,
  formatDateToOrdinalSuffix,
  get52WeeksDateRange,
  parseLocalDate,
} from "../utils/date-utils";
import { MonthRow } from "./month-row";
import "./contribution-heatmap.css";

interface TooltipState {
  text: string;
  x: number;
  y: number;
}

const defaultTooltipContent = (contribution: { date: string; contributions: number }) => {
  if (!contribution.contributions) {
    return `No contributions on ${formatDateToOrdinalSuffix(contribution.date)}`;
  }
  return `${contribution.contributions} contributions on ${formatDateToOrdinalSuffix(contribution.date)}`;
};

export function ContributionHeatmap({
  data = [],
  startDate,
  endDate,
  colors,
  thresholds: customThresholds,
  tooltipContent = defaultTooltipContent,
  onDayClick,
  showLegend = true,
  legendText = "Learn how we count contributions",
  legendLabels = ["Less", "More"],
  className,
}: ContributionHeatmapProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  if (Boolean(startDate) !== Boolean(endDate)) {
    throw new Error("Both startDate and endDate must be provided together.");
  }

  const { resolvedStart, resolvedEnd } = useMemo(() => {
    if (startDate && endDate) {
      return {
        resolvedStart: parseLocalDate(startDate),
        resolvedEnd: parseLocalDate(endDate),
      };
    }
    const range = get52WeeksDateRange(new Date());
    return {
      resolvedStart: parseLocalDate(range.startDate),
      resolvedEnd: parseLocalDate(range.endDate),
    };
  }, [startDate, endDate]);

  // O(1) lookup map + threshold level
  const { contributionMap, thresholds } = useMemo(() => {
    const map = new Map<string, number>();
    let maxContribution = 0;

    for (const item of data) {
      const total = (map.get(item.date) ?? 0) + item.contributions;
      map.set(item.date, total);
      if (total > maxContribution) {
        maxContribution = total;
      }
    }

    if (customThresholds) {
      return {
        contributionMap: map,
        thresholds: {
          level1: customThresholds[0],
          level2: customThresholds[1],
          level3: customThresholds[2],
        },
      };
    }

    return {
      contributionMap: map,
      thresholds:
        maxContribution === 0
          ? { level1: 1, level2: 2, level3: 3 }
          : {
              level1: Math.ceil(maxContribution * 0.25),
              level2: Math.ceil(maxContribution * 0.5),
              level3: Math.ceil(maxContribution * 0.75),
            },
    };
  }, [data, customThresholds]);

  const { grid, months } = useMemo(
    () => buildCalendarTable(resolvedStart, resolvedEnd),
    [resolvedStart, resolvedEnd],
  );

  const getLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
    if (count <= 0) return 0;
    if (count <= thresholds.level1) return 1;
    if (count <= thresholds.level2) return 2;
    if (count <= thresholds.level3) return 3;
    return 4;
  };

  const showCellTooltip = (target: HTMLElement, dateStr: string, count: number) => {
    const rect = target.getBoundingClientRect();
    setTooltip({
      text: tooltipContent({ date: dateStr, contributions: count }),
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const customColorsStyle = colors
    ? ({
        "--rch-color-0": colors[0],
        "--rch-color-1": colors[1],
        "--rch-color-2": colors[2],
        "--rch-color-3": colors[3],
        "--rch-color-4": colors[4],
      } as CSSProperties)
    : undefined;

  return (
    <div className={["rch", className].filter(Boolean).join(" ")} style={customColorsStyle}>
      <div className="rch__container">
        <div className="rch__table-wrapper">
          <table className="rch__table">
            <caption className="rch__sr-only">Contribution Graph</caption>
            <MonthRow months={months} />
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={DAY_LABELS[rowIndex]} className="rch__week-row">
                  <td className="rch__day-label-wrapper">
                    <span
                      className={
                        rowIndex % 2 !== 1 ? "rch__day-label rch__sr-only" : "rch__day-label"
                      }
                    >
                      {DAY_LABELS[rowIndex]}
                    </span>
                  </td>

                  {row.map((cell) => {
                    if (!cell.date) {
                      return <td key={cell.key} />;
                    }

                    const dateStr = cell.key;
                    const count = contributionMap.get(dateStr) ?? 0;
                    const level = getLevel(count);

                    return (
                      <td key={dateStr} className="rch__cell-slot">
                        <button
                          type="button"
                          data-level={level}
                          data-date={dateStr}
                          aria-label={tooltipContent({ date: dateStr, contributions: count })}
                          className="rch__cell"
                          onClick={
                            onDayClick
                              ? () => onDayClick({ date: dateStr, contributions: count })
                              : undefined
                          }
                          onMouseEnter={(e) => showCellTooltip(e.currentTarget, dateStr, count)}
                          onMouseLeave={() => setTooltip(null)}
                          onFocus={(e) => showCellTooltip(e.currentTarget, dateStr, count)}
                          onBlur={() => setTooltip(null)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tooltip && (
          <div
            role="tooltip"
            className="rch__tooltip"
            style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
          >
            {tooltip.text}
          </div>
        )}

        {showLegend && (
          <div className="rch__legend">
            <span className="rch__legend-text">{legendText}</span>
            <div className="rch__legend-scale">
              <span className="rch__legend-label">{legendLabels[0]}</span>
              {LEVELS.map((item) => (
                <div key={item.level} data-level={item.level} className="rch__legend-box">
                  <span className="rch__sr-only">{item.name}</span>
                </div>
              ))}
              <span className="rch__legend-label">{legendLabels[1]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
