# Visual Art Direction: System Pattern Visuals

## Status And Delivery Boundary

This document is an exploratory direction, not the shipped v1 API.
`PANEL-PATTERN-VISUAL-SYSTEM.md` defines the current production contract:
`PanelPatternVisualSystem`, four deterministic presets, and two semantic tones.

Do not introduce the proposed component, props, fonts, motion, or pattern
families below into the public system until a dedicated roadmap item is
approved. Future exploration should extend or deliberately replace the current
renderer only after migration and parity requirements are defined.

## Core Idea

System Pattern Visuals are code-generated brand visuals built from modular
rectangles, horizontal bars, mono symbols and structured negative space.

They should feel like a visualization of a system structure, not like a generic
illustration added on top of the interface. The visual language combines:

- visual modules: blocks, bars, panels, dividers, stepped layouts;
- code-like modules: brackets, slashes, colons, dots, dashes, plus signs,
  binary fragments and repeated mono characters;
- system rhythm: repeated widths, repeated heights, grid alignment and clear
  spacing logic.

The metaphor: design systems and AI-native interfaces are made of patterns,
components, code, context and reusable decisions.

## Visual Principles

### 1. System Before Decoration

Every visual should look constructed from a rule. Blocks can be expressive, but
they should not feel random.

Use:

- repeated bar heights;
- repeated width groups;
- grid-based alignment;
- controlled offsets;
- modular compositions;
- visible relationships between elements.

Avoid:

- organic blobs;
- decorative gradients without structure;
- random glitch effects;
- purely ornamental code snippets;
- illustrations that do not communicate system logic.

### 2. Code As Texture, Not Literal Code

The mono layer should not contain realistic source code. It should use small,
repeatable code-like symbols that work as visual material.

Preferred characters:

```txt
0 1
- -- ---
_ __ ___
. .. ...
:
/
//
\
[]
{}
()
<>
+
=
*
|
```

Good examples:

```txt
001101 0010 1110
---::---::---
[ ] { } / / / +
01..01..//::[]
```

The code layer should support the geometry of the visual. It can fill gaps,
extend bars, create rhythm, or act as a secondary layer behind stronger blocks.

### 3. Modular Bars And Panels

The visual system should use a few repeatable primitives:

- short bars;
- medium bars;
- long bars;
- stacked rows;
- stepped blocks;
- offset panels;
- text modules;
- code-text strips;
- pattern fills.

Bars can touch by edges or corners. When they connect, they should create
intentional relationships: steps, bridges, routes, stacks or system paths.

### 4. Text Can Be A Module

Text should sometimes sit inside rectangular modules instead of floating freely.
This makes copy feel like part of the system.

Use this for:

- labels;
- short technical captions;
- component names;
- process stage names;
- small metadata;
- case-study placeholders;
- system state labels.

Text modules should be sharp, flat and grid-aligned.

## Typography

### Recommended Mono Font

Use `Roboto Mono` as the default mono font for system visuals.

Reason:

- available from Google Fonts;
- neutral and technical without feeling too developer-tool specific;
- readable at small sizes;
- works well with symbols, digits and repeated characters;
- visually compatible with Inter.

CSS variable proposal:

```css
--font-family-mono: "Roboto Mono", ui-monospace, SFMono-Regular, Menlo, Monaco,
  Consolas, "Liberation Mono", "Courier New", monospace;
```

Possible alternatives for later visual explorations:

- `IBM Plex Mono` - more editorial and engineered;
- `JetBrains Mono` - more developer-tool feeling;
- `Space Mono` - more distinctive, slightly retro/technical;
- `Geist Mono` - very clean and modern.

For now, `Roboto Mono` is the safest starting point.

## Composition Patterns

### Pattern 1: Signal Stack

A vertical stack of horizontal bars. Each row uses the same height, but varied
widths. Some rows extend further to create a stepped silhouette.

Use for:

- process visuals;
- system maturity;
- layered workflow;
- documentation depth.

### Pattern 2: Code Grid

A block of repeated mono characters with a few stronger bars inserted into the
same grid.

Use for:

- AI context;
- documentation;
- code-based workflow;
- design system specs.

### Pattern 3: Modular Bridge

Two or more bar groups are connected by one offset bar. The visual should feel
like two systems being synchronized.

Use for:

- design to development;
- Figma to code;
- product strategy to implementation;
- component handoff.

### Pattern 4: Interface Panel

A rectangular panel divided into zones: heading, metadata, visual pattern,
footer/label. This can behave like a mini technical document.

Use for:

- project cards;
- service cards;
- callout visuals;
- case-study placeholders.

### Pattern 5: System Glitch

A mostly regular pattern with a controlled disruption in one area. The
disruption should be grid-based, not chaotic.

Use for:

- AI-native workflow;
- refactoring fragmented UI;
- before/after systemization;
- interface chaos becoming structured.

## Color Direction

The visuals should work inside the current neutral interface.

Base:

- neutral light or dark surfaces;
- sharp contrast;
- no rounded illustration cards unless the parent component requires it.

Accent:

- use one accent color per visual;
- do not mix many accent colors in one pattern;
- blue can be the main brand/system accent;
- purple or green can be exploration variants for technical/system visuals.

The visual should still work in monochrome or low-saturation mode. Accent color
should enhance structure, not carry the whole meaning.

## Technical Implementation

### Component Direction

Future exploration may evaluate a broader component, for example:

```txt
SystemPatternVisual
```

Possible props:

```txt
variant: "signal" | "code-grid" | "bridge" | "panel" | "glitch"
tone: "blue" | "purple" | "green" | "neutral"
density: "low" | "medium" | "high"
animated: boolean
label?: string
```

The component should be built from HTML/CSS primitives:

- wrapper div;
- rows;
- bars;
- mono text spans;
- optional label;
- optional data attributes for variants.

Avoid rendering these visuals as static images unless the visual is very
complex or needs a photographic texture.

These props are conceptual and are not supported by the current
`PanelPatternVisualSystem` API.

### CSS Structure

Use CSS variables for:

- bar height;
- row gap;
- module width;
- accent color;
- mono opacity;
- panel background;
- animation speed.

Example structure:

```html
<div class="system-pattern" data-variant="bridge" data-tone="blue">
  <div class="system-pattern__code">[] // 0101 :: --</div>
  <div class="system-pattern__bars">
    <span style="--x: 1; --y: 2; --w: 6"></span>
    <span style="--x: 4; --y: 3; --w: 10"></span>
    <span style="--x: 8; --y: 4; --w: 4"></span>
  </div>
</div>
```

Bars should be placed through CSS grid where possible:

```css
.system-pattern__bars {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: var(--pattern-row-height);
  gap: var(--pattern-gap);
}

.system-pattern__bars span {
  grid-column: var(--x) / span var(--w);
  grid-row: var(--y);
}
```

## Motion Direction

Motion should be subtle and system-like.

Good animation ideas:

- mono characters flip between `0`, `1`, `/`, `-`, `.`, `:`;
- selected bars fade in sequentially;
- short bars extend from left to right;
- code rows refresh in small groups;
- pattern opacity pulses very slightly;
- one central area changes while the rest remains stable.

Avoid:

- constant chaotic randomization;
- heavy canvas animations for simple patterns;
- large layout shifts;
- fast glitch effects that feel noisy;
- animations that distract from reading.

Technical notes:

- use CSS animations for bars and opacity;
- use a small JS helper only for character refresh;
- use `IntersectionObserver` to animate only when visible;
- respect `prefers-reduced-motion`;
- keep generated DOM small and predictable.

## Performance Rules

These visuals should be lightweight.

Prefer:

- divs and spans;
- CSS grid;
- CSS variables;
- limited DOM nodes;
- controlled JS only when needed.

Avoid:

- heavy canvas unless there is a clear reason;
- SVG with hundreds of manually generated nodes;
- image assets for simple modular patterns;
- runtime randomness that changes layout dimensions.

## Usage In The Website

Potential placements:

- `CalloutCard.Visual`;
- project card visual placeholders;
- service/package visuals;
- process section accents;
- hero image overlays;
- case-study system diagrams;
- empty states or proof-of-system moments.

The visuals should not appear everywhere at once. Use them as strong brand
signals in selected places, so they remain distinctive.

## Relationship To Brand Strategy

This visual language supports the project positioning:

- system thinking over one-off screens;
- design and code as one connected workflow;
- AI context as structured, documented knowledge;
- reusable patterns instead of manual repetition;
- interfaces that can be extended by people and AI.

The strongest message:

```txt
The interface is not just designed.
It is structured, documented and ready to evolve.
```
