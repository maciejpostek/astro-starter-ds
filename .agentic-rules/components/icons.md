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

Use only the 45 curated Google Material Symbols in the manifest. Render each
glyph as local inline SVG with the Sharp profile: optical size 20, weight 400, grade 0,
fill 0. Lucide, icon fonts, runtime requests, Unicode glyphs, and pasted SVG
paths in consumers are forbidden.

Each Figma icon master uses a `20 × 20` inner group with locked 1:1 aspect ratio
and horizontal `Fill container` sizing. The vector remains centered and bound
to `Color Semantic / Global/icon/primary`.

Astro renderers inherit color through `currentColor`. Parent components control
both icon dimensions through the shared `size` value; its default `1em` follows
the parent's font size. Keep width and height equal and use
`preserveAspectRatio="xMidYMid meet"` so glyph geometry is never distorted.

Do not import the complete Google catalog. Do not expose icon selection from a
consumer component.

A consumer master owns one fixed semantic icon across all states. It exposes no
INSTANCE_SWAP, icon slot, or arbitrary icon-name prop. A documented Boolean may
hide the icon. Change a glyph only in the consumer master, then re-check color
and size bindings. Astro hardcodes the same MaterialSymbol name.

## UX purpose

Render one canonical, recognizable Material Symbol without adding runtime icon
fonts, network requests or consumer-owned SVG paths.

## Use when

- A curated symbol already exists in `iconLibrary.json` for the required meaning.
- An interface needs a decorative or labelled semantic glyph rendered inline.

## Avoid when

- The required glyph is outside the curated manifest.
- A consumer wants arbitrary icon swapping instead of owning one semantic icon.

## Content contract

- Use the canonical Google snake_case name from the local manifest.
- A decorative glyph has no accessible name; the parent control owns the label.
- A standalone meaningful glyph requires an explicit accessible label from its caller.

## Composition and placement

- Keep width and height equal and preserve the canonical 1:1 optical canvas.
- Let the parent component own color and the final rendered size.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: equal `size` dimensions, `1em` default sizing, `currentColor` and `preserveAspectRatio="xMidYMid meet"`.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: The glyph scales with its owning component and never swaps, crops or changes meaning at a viewport width.

## Accessibility and required behavior

- Keep decorative SVGs out of the accessibility tree.
- Do not use color alone to communicate an interaction or status.
- Preserve the parent control's accessible name and focus behavior.

## Related components

- Button, ButtonLink, IconButton, SearchInput and Tag consume fixed canonical symbols.

## Core decision

Use MaterialSymbol only for an approved local manifest entry and let the
semantic consumer own selection, interaction and accessible naming.
