# Material Symbols

Status: active asset rule.

Canonical catalog: `src/data/design-system/iconLibrary.json`
Astro renderers: `src/components/assets/icons/MaterialSymbol.astro` and
`MaterialSymbol.tsx`
Figma page: `     ↪  ◆  Icons`

Provider: Google Material Symbols
Figma naming: `Icon/Material/<google_snake_case_name>`
Default optical canvas: `20 × 20`
License: Apache License 2.0

Use only the 30 curated Google Material Symbols in the manifest. Render each
glyph as local inline SVG with the Outlined profile: optical size 20, weight 400, grade 0,
fill 0. Lucide, icon fonts, runtime requests, Unicode glyphs, and pasted SVG
paths in consumers are forbidden.

Do not import the complete Google catalog. Do not expose icon selection from a
consumer component.

A consumer master owns one fixed semantic icon across all states. It exposes no
INSTANCE_SWAP, icon slot, or arbitrary icon-name prop. A documented Boolean may
hide the icon. Change a glyph only in the consumer master, then re-check color
and size bindings. Astro hardcodes the same MaterialSymbol name.
