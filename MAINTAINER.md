# Maintainer Runbook

Operational notes for maintaining `react-contribution-heatmap`, npm releases, and the Vercel demo.

## 1. Daily Workflow

Before committing changes, run:

```bash
npm run check
```

_(Runs Biome auto-format/lint, TypeScript typecheck, Vitest, and tsup build)._

## 2. Releasing

Ensure the working tree is clean on `main`, then run one of the release scripts:

- `npm run release:patch` — Bug fixes (`x.x.+1`)
- `npm run release:minor` — Backward-compatible features (`x.+1.0`)
- `npm run release:major` — Breaking changes (`+1.0.0`)

Pushing the version tag automatically triggers GitHub Actions to run checks, publish to npm with provenance, and create a GitHub Release.

## 3. Recovering a Failed Release Tag

If a version tag was pushed before CI passed:

```bash
# Fix and commit the issue on main first, then:
git tag -f vX.Y.Z
git push origin main
git push origin vX.Y.Z --force
```

## 4. Reviewing & Merging Contributor PRs

1. Confirm the **`verify`** status check on the PR is green.
2. Click **Squash and merge** on GitHub.
3. Pull changes locally (`git pull origin main`) and run `npm run release:patch` or `npm run release:minor` when ready to publish.

## 5. Vercel Demo Configuration

Keep **Root Directory** at `.` (root) because `examples/basic` imports the built `dist/` bundle from root:

- **Build Command:** `npm run build && npm --workspace=examples/basic run build`
- **Output Directory:** `examples/basic/dist`
