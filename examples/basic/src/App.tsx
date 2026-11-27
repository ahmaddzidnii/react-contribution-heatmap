import {
  ContributionHeatmap,
  type ContributionItem,
  get52WeeksDateRange,
} from "react-contribution-heatmap";

import "react-contribution-heatmap/style.css";

function generateDataByDateRange(startDate: string, endDate: string): ContributionItem[] {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const generatedData: ContributionItem[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    generatedData.push({
      date: `${year}-${month}-${day}`,
      contributions: Math.floor(Math.random() * 51),
    });
  }

  return generatedData;
}

function App() {
  const { startDate, endDate } = get52WeeksDateRange();
  const data = generateDataByDateRange(startDate, endDate);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <ContributionHeatmap data={data} startDate={startDate} endDate={endDate} />
    </div>
  );
}

export default App;
