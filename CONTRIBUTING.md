## Releasing

Ensure the working tree is clean on `main`, then run one of the release scripts:

- `npm run release:patch` — Bug fixes (`x.x.+1`)
- `npm run release:minor` — Backward-compatible features (`x.+1.0`)
- `npm run release:major` — Breaking changes (`+1.0.0`)

Pushing the version tag automatically triggers GitHub Actions to run checks, publish to npm with provenance, and create a GitHub Release.
