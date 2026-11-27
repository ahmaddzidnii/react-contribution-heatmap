export interface ContributionItem {
  date: string;
  contributions: number;
}

export interface MonthColumn {
  name: string;
  year: number;
  colSpan: number;
}

export interface ContributionHeatmapProps {
  /** Array of daily contribution records (`YYYY-MM-DD`). Duplicate dates are summed automatically. */
  data?: ContributionItem[];
  /** Start date in `YYYY-MM-DD` format (defaults to 52 weeks ago aligned to Sunday). Must be provided with `endDate`. */
  startDate?: string;
  /** End date in `YYYY-MM-DD` format (defaults to today). Must be provided with `startDate`. */
  endDate?: string;
  /** Custom tuple of 5 colors mapped from level 0 (empty) to level 4 (highest). */
  colors?: [string, string, string, string, string];
  /** Custom upper bounds for levels 1, 2, and 3 (values above the 3rd bound become level 4). */
  thresholds?: [number, number, number];
  /** Custom formatter for the tooltip and screen-reader label on hover or focus. */
  tooltipContent?: (item: ContributionItem) => string;
  /** Callback fired when a day cell is clicked. */
  onDayClick?: (item: ContributionItem) => void;
  /** Show or hide the bottom legend footer. @default true */
  showLegend?: boolean;
  /** Helper text displayed on the left side of the legend. @default "Learn how we count contributions" */
  legendText?: string;
  /** Custom labels for the min/max ends of the legend scale. @default ["Less", "More"] */
  legendLabels?: [string, string];
  /** Optional CSS class name applied to the root container. */
  className?: string;
}
