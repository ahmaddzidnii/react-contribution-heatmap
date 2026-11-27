export interface ContributionItem {
  date: string; // Format: YYYY-MM-DD
  contributions: number;
}

export interface MonthColumn {
  name: string;
  year: number;
  colSpan: number;
}

export interface ContributionHeatmapProps {
  data?: ContributionItem[];
  startDate?: string;
  endDate?: string;
  /** Custom 5 warna dari level 0 (kosong) sampai level 4 (tertinggi) */
  colors?: [string, string, string, string, string];
  /** Custom teks tooltip saat hover/focus sel */
  tooltipContent?: (item: { date: string; contributions: number }) => string;
  /** Tampilkan atau sembunyikan footer legenda (default: true) */
  showLegend?: boolean;
  /** Teks di sebelah kiri legenda (default: "Learn how we count contributions") */
  legendText?: string;
  className?: string;
}
