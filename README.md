## React Contribution Heatmap

<div align="center">
  <img src="[https://raw.githubusercontent.com/ahmaddzidnii/react-contribution-heatmap/main/assets/preview.png](https://raw.githubusercontent.com/ahmaddzidnii/react-contribution-heatmap/main/assets/preview.png)" alt="React Contribution Heatmap Preview" />
</div>

<br />

<div align="center">
  <img src="[https://img.shields.io/npm/v/react-contribution-heatmap](https://img.shields.io/npm/v/react-contribution-heatmap)" alt="NPM Version" />
  <img src="[https://img.shields.io/npm/l/react-contribution-heatmap](https://img.shields.io/npm/l/react-contribution-heatmap)" alt="License" />
  <img src="[https://img.shields.io/github/stars/ahmaddzidnii/react-contribution-heatmap](https://img.shields.io/github/stars/ahmaddzidnii/react-contribution-heatmap)" alt="GitHub Stars" />
</div>

<br />

<div align="center"><strong>React Contribution Heatmap – Visualize Data with Style.</strong></div>
<div align="center">A lightweight, zero-dependency, and accessible GitHub-style contribution heatmap component for React. Whether you're tracking user activity, visualizing streak data, or enhancing dashboards, this package makes it effortless to render clean heatmaps.</div>

<br />

<div align="center">
  <a href="[https://react-contribution-heatmap.ahmadzidni.com](https://react-contribution-heatmap.ahmadzidni.com)"><strong>Live Demo →</strong></a>
</div>

<br />

<div align="center">
  <sub>Cooked by <a href="[https://github.com/ahmaddzidnii](https://github.com/ahmaddzidnii)">ahmaddzidniii</a> 👨‍🍳</sub>
</div>

<br />

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Customizing Colors](#customizing-colors)
- [API](#api)

<br />

## Features

- ✅ **Zero dependencies** — No external tooltip or CSS-in-JS bloat (~14 kB total package size)
- ✅ **Theme & Dark Mode ready** — Inherits text color automatically and adapts to Tailwind CSS / Shadcn UI tokens
- ✅ **Accessible by default** — Semantic `<table>` layout, screen-reader labels, and keyboard navigation
- ✅ **Built-in helpers & TypeScript** — Includes `get52WeeksDateRange()` and full `.d.ts` types

## Installation

#### With npm

```sh
npm install react-contribution-heatmap
```

#### With pnpm

```sh
pnpm add react-contribution-heatmap
```

#### With Yarn

```sh
yarn add react-contribution-heatmap
```

## Getting Started

Import `ContributionHeatmap` along with its default stylesheet (`react-contribution-heatmap/style.css`). You can also use the built-in `get52WeeksDateRange()` helper to generate a 52-week range aligned to Sunday:

```tsx
import {
  ContributionHeatmap,
  type ContributionItem,
  get52WeeksDateRange,
} from "react-contribution-heatmap";
import "react-contribution-heatmap/style.css";

function generateDummyData(startDate: string, endDate: string): ContributionItem[] {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const data: ContributionItem[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    data.push({
      date: `${year}-${month}-${day}`,
      contributions: Math.floor(Math.random() * 20),
    });
  }

  return data;
}

const formatTooltip = (item: ContributionItem) =>
  item.contributions === 0
    ? `No contributions on ${item.date}`
    : `${item.contributions} contributions on ${item.date}`;

export function App() {
  const { startDate, endDate } = get52WeeksDateRange();
  const data = generateDummyData(startDate, endDate);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <ContributionHeatmap
        data={data}
        startDate={startDate}
        endDate={endDate}
        tooltipContent={formatTooltip}
      />
    </div>
  );
}
```

## Customizing Colors

You can customize the 5-level color scale either directly through props or via CSS variables (without needing `!important`).

### Option 1: Using the `colors` prop

Pass a tuple of 5 colors from level `0` (no contributions) to level `4` (highest contributions):

```tsx
const customColors: [string, string, string, string, string] = [
  "#ebedf0",
  "#c6e48b",
  "#7bc96f",
  "#239a3b",
  "#196127",
];

<ContributionHeatmap data={data} colors={customColors} />;
```

### Option 2: Using CSS Variables (Dark Mode & Shadcn UI)

Labels inherit your page's text color automatically. Override the `.rch` CSS custom properties in your stylesheet to match Dark Mode or Shadcn UI theme tokens:

```css
.rch {
  --rch-color-0: #161b22;
  --rch-color-1: #0e4429;
  --rch-color-2: #006d32;
  --rch-color-3: #26a641;
  --rch-color-4: #39d353;
}
```

For **Shadcn UI** projects, bind directly to your theme variables so light/dark mode switches automatically:

```css
.rch {
  --rch-border-color: var(--border);
  --rch-muted-color: var(--muted-foreground);
  --rch-color-0: var(--muted);
  --rch-color-1: color-mix(in oklab, var(--primary) 25%, var(--muted));
  --rch-color-2: color-mix(in oklab, var(--primary) 50%, var(--muted));
  --rch-color-3: color-mix(in oklab, var(--primary) 75%, var(--muted));
  --rch-color-4: var(--primary);
}
```

## API

| Prop             | Type                                                        | Default                              | Description                                                                                     |
| ---------------- | ----------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `data`           | `Array<{ date: string; contributions: number }>`            | `[]`                                 | Array of daily contribution records (`YYYY-MM-DD`). Duplicate dates are summed automatically.   |
| `startDate`      | `string`                                                    | 52 weeks ago (Sunday)                | Start date in `YYYY-MM-DD` format. Must be provided together with `endDate`.                    |
| `endDate`        | `string`                                                    | Today                                | End date in `YYYY-MM-DD` format. Must be provided together with `startDate`.                    |
| `colors`         | `[string, string, string, string, string]`                  | GitHub green palette                 | Tuple of 5 color values mapped to levels `0` through `4`.                                       |
| `thresholds`     | `[number, number, number]`                                  | Auto-scaled                          | Custom upper bounds for levels `1`, `2`, and `3` (values above the 3rd bound become level `4`). |
| `tooltipContent` | `(item: { date: string; contributions: number }) => string` | Ordinal date text                    | Function to customize the tooltip text displayed on hover and keyboard focus.                   |
| `onDayClick`     | `(item: { date: string; contributions: number }) => void`   | `undefined`                          | Callback fired when a day cell is clicked.                                                      |
| `showLegend`     | `boolean`                                                   | `true`                               | Show or hide the bottom legend footer.                                                          |
| `legendText`     | `string`                                                    | `"Learn how we count contributions"` | Helper text displayed on the left side of the legend.                                           |
| `legendLabels`   | `[string, string]`                                          | `["Less", "More"]`                   | Custom labels for the min and max ends of the legend scale.                                     |
| `className`      | `string`                                                    | `undefined`                          | Optional CSS class name applied to the root container.                                          |

## License

MIT
