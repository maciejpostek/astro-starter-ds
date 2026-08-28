# Section and grid-column authoring

Use this reference only when a reusable Figma component depends materially on
site-grid columns, column spans, start positions, or viewport breakout. Ordinary
atoms and intrinsic molecules do not need this workflow.

## Resolve the live layout contract

Before writing, read the layout adapter in
`Figma2Astro Agentic Rules/04-layout.md` and the target component record in
`src/data/design-system/componentArchitecture.json`. Inspect the live Figma
collections, modes, Variable IDs, Grid Style, bindings, Auto Layout and direct
dependencies.

Treat these as separate responsibilities:

- `Layout/Site Grid` is the visual grid source of truth;
- `Layout Semantic` owns container, padding, column-count and gap semantics;
- `Layout Grid Columns` supplies local Figma-only max-width and start-offset
  measurements;
- Astro owns runtime CSS Grid, named lines, intermediate breakpoints and
  viewport behavior.

Do not copy span tables or pixel values from memory. Resolve them from the live
collection. If the collection is missing, duplicated, orphaned or stale, stop
the component mutation and route the repair through
`astro-figma-variable-system`.

## Decide layout ownership

Identify whether the canonical master represents:

1. the inner `container/main` composition; or
2. a full-width `Section Shell` containing an inner `Content Grid`.

For an inner composition, the reusable root normally fills its consumer and is
limited by the current `span/12` measurement. Do not add viewport width or site
padding to that root.

For a full-width shell, keep viewport background or edge-owned media on the
shell and put ordinary content in one explicit inner grid/container frame. Do
not apply site padding at both levels. Documentation padding belongs only to
the documentation wrapper and must not leak into instances.

## Author column spans

- Keep a region in Auto Layout with `Fill container` and bind its `maxWidth` to
  `Layout Grid Columns / grid/max-width/span/NN`.
- A span controls maximum width, not position. Let Auto Layout distribution,
  sibling spans and the grid gap derive the final `x` position.
- Use a start-offset Variable only as parent padding or a controlled spacer
  measured from `content-start`. Never bind or emulate a raw `x` coordinate.
- Do not create `column-width`, local span tokens, duplicated numeric
  Variables, or CSS custom properties for solved measurements.
- Keep intrinsic content, reusable nested instances and slot content flexible
  inside the bounded region. Use `Fill + maxWidth`, not a fixed width, when the
  region must collapse below its desktop span.
- The component that owns repeatable horizontal content also owns wrapping.
  Ensure every intermediary wrapper passes the allocated width with `Fill` and
  propagates the wrapped height with `Hug`.

## Apply modes and responsive structure

Apply the matching `Layout Semantic` and `Layout Grid Columns` mode on the
canonical frame, Component or ComponentSet that owns the layout context. Do not
spray the mode onto descendants.

Use a component variant for responsive reflow only when the component contract
already needs a structural change that collection modes cannot express, such
as horizontal to stacked composition. Do not add a `Device` or `Tablet` axis by
default. Figma Desktop and Mobile are design control points; Astro must retain
the approved intermediate grid behavior.

Measurements that exceed the active column count may saturate at the container
width according to the live adapter. A saturated max-width is compatible with
`Fill container` and must not be replaced with a separate mobile width.

## Handle breakout explicitly

`Layout Grid Columns` offsets begin at `content-start`; they do not represent
viewport `full-start` or `full-end` lines.

For a breakout section:

- identify which content regions remain on the main grid;
- identify the exact column line where breakout content begins;
- identify whether the breakout edge is `full-start` or `full-end`;
- keep the viewport-edge region separate from the bounded content region;
- record the future Astro mapping to the approved breakout grid object and
  named lines;
- do not invent a Figma Variable for the viewport edge unless the variable
  architecture is separately approved.

## Name the anatomy

Use semantic English layer names that communicate layout responsibility:

- shell and grid: `Section Shell`, `Content Grid`;
- bounded areas: `Content Region`, `Heading Region`, `Details Region`,
  `Visual Region`;
- composition: `Heading Group`, `Content Stack`, `Details Stack`;
- actions: `Action Area`, `Actions`, then the reusable action instance;
- text wrappers: `Heading Block`, `Heading Text`, `Paragraph Block`,
  `Paragraph Text`.

Do not leave generated names such as `Frame 4`, ambiguous duplicate
`Heading`/`Paragraph` names, or names that describe only current geometry.
Do not rename internal descendants of nested reusable instances as part of the
parent component cleanup.

## Record the Astro handoff

Update the existing Figma component contract and component divergence record
with the semantic layout intent. Record at least:

- the owner of the layout mode;
- each important region's span and start intent;
- any viewport-edge breakout intent;
- the layer that owns wrapping;
- the expected Astro layout object or named grid-line mapping;
- whether mobile or tablet composition is approved, absent or Astro-owned.

Keep pixel widths and `x` positions only as validation snapshots. They are not
Astro tokens, props or public API. A typical translation is:

```text
Figma Fill + maxWidth span/NN + start intent
-> Astro grid-column start/end or named lines

Figma viewport-edge breakout intent
-> approved breakout grid object with full-start/full-end
```

Do not mark a Figma-only section as mapped or invent an Astro component source
path before a separate implementation request approves that boundary.

## Validate the component

Validate both the reusable master and a temporary instance:

- the intended layout modes are present only on their owner;
- every span and offset binding references the live canonical Variable ID;
- solved widths match the active mode within the adapter's tolerance;
- start positions equal the intended grid line relative to `content-start`;
- breakout content reaches the declared viewport edge without double padding;
- nested instances, slots, properties and existing bindings are preserved;
- `Fill`, `maxWidth`, wrapping and vertical `Hug` work at narrower widths;
- no documentation fill, stroke, radius, padding or gap leaks into the
  production instance;
- desktop and mobile screenshots match the approved composition;
- the durable Figma-to-Astro record describes intent rather than pixel output.

When Astro implementation exists or is part of the request, also validate the
runtime at narrow, intermediate and wide viewports and confirm that CSS Grid
lines reproduce the Figma intent without exporting `Layout Grid Columns`.
