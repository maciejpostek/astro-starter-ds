# Icon Assets

Status: active asset rule.

Canonical catalog: `src/data/design-system/iconLibrary.json`
Astro renderers: `src/components/assets/icons/MaterialSymbol.astro`,
`MaterialSymbol.tsx`, and `SocialIcons.astro`
Figma page: `     ↪  ◆  Icons`

## Material Symbols contract

Provider: Google Material Symbols
Figma naming: `Icon/Material/<google_snake_case_name>`
Default optical canvas: `20 × 20`
License: Apache License 2.0

Use only the 52 curated Google Material Symbols in the manifest. Render each
glyph as local inline SVG with the Sharp profile: optical size 20, weight 400,
grade 0, and fill 0 by default. `star_filled` is the sole bounded profile
exception: it aliases Google's canonical `star` glyph with fill 1, while
`star` keeps fill 0. Lucide, icon fonts, runtime requests, Unicode glyphs, and
pasted SVG paths in consumers are forbidden.

Each Figma icon master uses a `20 × 20` inner group with locked 1:1 aspect
ratio and horizontal `Fill container` sizing. The vector remains centered
and bound to `Color Semantic / Global/icon/primary`.

Astro renderers inherit color through `currentColor`. Parent components control
both icon dimensions through the shared `size` value; its default `1em` follows
the parent's font size. Keep width and height equal and use
`preserveAspectRatio="xMidYMid meet"` so glyph geometry is never distorted.

Do not import the complete Google catalog. Do not expose icon selection from a
consumer component.

Accordion has one explicit bounded exception: its `brandIcon` prop accepts the
`MaterialSymbolName` union generated from all 52 entries in the local manifest.
The disclosure icon remains fixed to `arrow_drop_down`. Figma intentionally
projects only `language` until a dedicated Accordion icon family is expanded;
this recorded difference does not narrow the Astro type.

A consumer master owns one fixed semantic icon across all states. It exposes no
INSTANCE_SWAP, icon slot, or arbitrary icon-name prop. A documented Boolean may
hide the icon. Change a glyph only in the consumer master, then re-check color
and size bindings. Astro hardcodes the same MaterialSymbol name.

The feedback family has one bounded semantic-axis exception: `Alert`,
`NotificationAndToast` maps `error` to `error`, `warning` to `warning`,
`success` to `check_circle`, `info` to `info`, and `feature` to `star_rate`.
This closed mapping is owned by `src/lib/feedback/feedbackModel.mjs`; consumers
still receive no icon prop, icon slot, glyph name or instance-swap capability.

## Social Icons contract

Canonical social catalog: `src/data/design-system/iconLibrary.json#social`
Canonical Figma ComponentSet: `Social Icons` (`964:9411`)
Astro renderer: `src/components/assets/icons/SocialIcons.astro`

Use exactly the 26 approved platform identities from the manifest. The
`platform` prop is required and uses a lowercase stable slug. The
`variant` prop is `brand | monochrome` and defaults to `brand`.

- `brand` preserves every fixed fill, gradient, mask, and geometry exported
  from Figma Color=Original. These platform-owned paints are asset data, not
  project color tokens.
- `monochrome` uses the Figma Color=Negative geometry and replaces drawable
  paints with `currentColor`.
- The renderer has no `size` prop. Its SVG uses `width="100%"` and
  `height="100%"`; the consumer parent owns both dimensions.
- Keep all SVG geometry local. Runtime URLs, icon fonts, consumer-supplied SVG,
  and hand-redrawn platform marks are forbidden.
- Preserve `preserveAspectRatio="xMidYMid meet"` so non-square parent boxes
  cannot distort the mark.

## UX purpose

Render one canonical, recognizable Material Symbol or social platform mark
without adding runtime icon fonts, network requests, or consumer-owned SVG
paths.

## Use when

- A curated symbol already exists in `iconLibrary.json` for the required meaning.
- An interface needs a decorative or labelled semantic glyph rendered inline.
- A social platform identity exists in the canonical `social.platforms` catalog.

## Avoid when

- The required glyph is outside the curated manifest.
- A consumer wants arbitrary Material Symbol swapping instead of owning one semantic icon.
- A social platform is not present in the approved Figma ComponentSet.

## Content contract

- Use the canonical Google snake_case name from the local manifest.
- Use the canonical lowercase social platform slug for `SocialIcons`.
- A decorative glyph has no accessible name; the parent control owns the label.
- A standalone meaningful glyph requires an explicit accessible label from its caller.

## Composition and placement

- Keep width and height equal and preserve the canonical 1:1 optical canvas.
- Let the parent component own color and the final rendered size.
- For SocialIcons, size the parent box; brand ignores parent color while
  monochrome inherits it.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: MaterialSymbol uses equal `size` dimensions and a `1em` default; SocialIcons fills the parent width and height; both use `currentColor` where applicable and `preserveAspectRatio="xMidYMid meet"`.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: The glyph scales with its owning component and never swaps, crops, or changes meaning at a viewport width.

## Accessibility and required behavior

- Keep decorative SVGs out of the accessibility tree.
- Do not use color alone to communicate an interaction or status.
- Preserve the parent control's accessible name and focus behavior.
- Give a standalone meaningful SocialIcons instance an explicit `label`.

## Related components

- Button, ButtonLink, IconButton, SearchInput, and Tag consume fixed canonical Material Symbols.
- Social links and platform identity patterns may consume SocialIcons.

## Naming and token contract

Use the canonical `MaterialSymbol` and `SocialIcons` identities, manifest-backed
names and asset-owned rendering contracts. Consumers control size and semantic
color through existing registered groups; asset renderers do not declare local
design tokens or create component token namespaces.

## Core decision

Use an icon renderer only for an approved local manifest entry. Let the
semantic consumer own interaction and accessible naming, and let the parent
own SocialIcons dimensions.
