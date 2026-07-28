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

## Border Model

The table wrapper owns:

- top border,
- left border,
- horizontal overflow.

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

Example:

```astro
<DsTableFrame
  label="Component size attributes"
  columns="minmax(14rem, 0.2fr) minmax(9rem, 0.14fr) minmax(20rem, 0.34fr) minmax(10rem, 0.16fr) minmax(10rem, 0.16fr)"
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
