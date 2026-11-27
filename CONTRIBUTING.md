# Contributing to `react-contribution-heatmap`

Thank you for considering contributing to `react-contribution-heatmap`!

## Prerequisites

- **Node.js** 20 or 22+
- **npm** 10+

## Local Development

1. Fork and clone the repository:

   ```bash
   git clone [https://github.com/ahmaddzidnii/react-contribution-heatmap.git](https://github.com/ahmaddzidnii/react-contribution-heatmap.git)
   cd react-contribution-heatmap
   ```

2. Install dependencies (automatically sets up Husky git hooks):

   ```bash
   npm install
   ```

3. Start the local playground:

   ```bash
   npm run dev
   ```

## Project Structure

- `src/` — Library source code, styles, and TypeScript types.
- `examples/basic/` — Local Vite playground for visual testing.
- `tests/` — Vitest unit and component interaction tests.

## Pull Request Checklist

A Husky pre-commit hook runs formatting and type checks automatically on commit. Before opening a pull request, ensure the full suite passes locally:

```bash
npm run check
```

Please keep commits focused and include tests in `tests/` for any bug fixes or new props.
