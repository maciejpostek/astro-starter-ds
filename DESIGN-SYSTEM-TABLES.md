# Design System Table Rules

This document defines how documentation tables are built inside the Astro design system.

The goal is to avoid one-off table layouts. Design system pages should compose tables from shared table atoms, not local cell, border, copy button, or sample implementations.

## Table Atom Components

Use these components for design system documentation tables:

- `DsTableFrame` - table wrapper, overflow, outer borders and table sizing profile.
- `DsTableRow` - grid-based header/body row.
- `DsTableCell` - default header/body cell.
- `DsTableCopyCell` - cell with text/code and shared copy-to-clipboard behavior.
- `DsTableSampleCell` - cell with sizing, radius or border sample preview.
- `DsCopyButton` - shared copy button used by table cells.

## Rules

Do not create local table borders in page files.

Do not create local copy-to-clipboard buttons for tables.

Do not create local sample rectangles or radius previews when `DsTableSampleCell` can be used.

Use `DsTableFrame` for the outer table frame and horizontal overflow behavior.

Use `DsTableCell` for all header and body cells unless a specialized atom exists.

Use `DsTableCopyCell` whenever a token, class, selector, attribute or code value should be copied.

Use `DsTableSampleCell` for visual previews of size, radius and border tokens.

Every textual cell renders on one line. `DsTableCell` applies ellipsis by
default and the shared `DsTableFrame` tooltip manager exposes the full value on
hover and keyboard focus only when the text is actually clipped. Copy and
other actions remain outside the shrinkable text target. Visual samples opt out
explicitly with `overflow="visible"`.

Standard documentation tables use the inline-end bleed contract as a limit,
not a forced width. Their left edge remains aligned with the centered content
column. A table fills that column, grows toward its declared `minWidth` only
when needed, and stops at the right edge of the main documentation area. Wider
surfaces scroll inside that viewport; the page itself never gains horizontal
overflow.

## Border Model

The table scroll container owns:

- horizontal overflow.

The inner table surface owns:

- top border,
- left border,
- the shared minimum width for every row.

Each table cell owns:

- right border,
- bottom border.

This creates one consistent grid without duplicate border logic.

## Sizing

Tables use `data-ds-doc-table-size="tiny"` by default.

Table row, header, padding, font and sample dimensions come from documentation table tokens in `src/styles/tokens/design-system-components.css`.

Do not hardcode table row heights, padding or fonts in page-local CSS.

## Custom Column Counts

Different tables can have different columns.

Use `DsTableFrame` with a custom `columns` value when the default token table grid is not correct.
Every flexible maximum must use at least `1fr`; do not use partial factors such
as `0.22fr`. The declared `minWidth` must be at least the sum of all column
minimums, so the inner surface, rows and borders always share one width.

Foundation tables use these shared column dimensions:

- token: minimum `22rem`,
- standard sample: fixed `8rem`,
- short value such as HEX or PX: fixed `10rem`,
- Light/Dark mode value: minimum `26rem`,
- sample inside a Light/Dark cell: fixed `var(--size-80)`.

Responsive tables preserve these minimums. Narrow viewports reduce cell
padding but use the table's own horizontal scroll instead of shrinking columns
until technical values wrap.

Visual sample cells stretch their direct content to the full available row
height. Color rows render their resolved canonical variable as the sample, so
empty visual elements never collapse or lose their background.

Example:

```astro
<DsTableFrame
  label="Component size attributes"
  minWidth="63rem"
  columns="minmax(14rem, 20fr) minmax(9rem, 14fr) minmax(20rem, 34fr) minmax(10rem, 16fr) minmax(10rem, 16fr)"
>
  ...
</DsTableFrame>
```

## Current Usage

The Sizing page currently uses the shared table atoms in:

- `DsSpacingBlock`
- `DsSpacingRow`
- `DsAttributeBlock`

Future Design System tables should follow the same pattern.

Color foreground samples resolve their surface from the shared Foundations
resolver. Component text and icon states use their matching component
background state; inverse, on-accent, status and disabled values use the
corresponding semantic surface. Never change token values to improve a
documentation sample.

Text Style profiles use `DsTypographyStyleProfile`. Name, Class and Sample are
visible initially; technical rows live in an independently controlled,
accessible disclosure. Profiles always stack vertically at full available
width, and the sample cell remains a visual overflow exception. Sample copy
wraps within `32ch` and reserves at least three typographic lines so every
profile presents a comparable preview area.
