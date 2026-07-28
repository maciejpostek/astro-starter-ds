# Generated Architecture Renders

SVG files in this directory are generated from `architecture/system-map.json`
through `scripts/generate-architecture-views.mjs` and the D2 CLI.

Do not edit generated SVG files. Change the canonical graph or view definition,
regenerate the `.d2` projection, and render again.

An empty SVG set is valid only when the D2 CLI is unavailable and the generator
has reported the skipped render. Use `--require-svg` when SVG output is a hard
requirement.
