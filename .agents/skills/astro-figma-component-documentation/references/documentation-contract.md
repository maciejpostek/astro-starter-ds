# Figma Component Documentation Contract

This is the canonical Figma-only presentation contract for Astro Design System
framework component pages.

## 1. Terminology

- **Documentation wrapper**: the ordinary page-level Auto Layout frame named
  `DSD/{Page} Documentation`.
- **Component group**: the ordinary frame named
  `Component Group / {Display Name}`.
- **Group label**: an instance of the shared
  `DSD - Component Group Label` component.
- **Master set**: the `ComponentSet` that contains the real reusable component
  variants and owns documentation presentation styling.
- **Reusable master**: a `Component` child of the master set. Figma calls such
  a child a variant component; it is not an `Instance`.
- **Documentation styling**: presentation-only padding, gap, radius, purple
  dashed stroke, and optional preview sizing applied to the master set.

Do not call a reusable variant an instance when node type precision matters.

## 2. Canonical hierarchy

```text
     ↪  {category marker}  {Page}
`-- DSD/{Page} Documentation
    |-- Header
    `-- Component Group / {Display Name}
        |-- DSD - Component Group Label
        `-- {PascalCaseName}
            |-- {AxisA=Value, State=Default}
            |-- {AxisA=Value, State=Hover}
            `-- ...
```

The page wrapper and component groups are ordinary frames. Do not convert them
into public components, use detached component copies, or create a reusable
component-page wrapper.

Each separately reusable master or intentionally reviewed family gets its own
component group. The group label uses the category marker and a human-readable
display name; the master set keeps the stable PascalCase component identity.

## 3. Page and group layout

Use the current framework canvas values:

| Layer | Layout contract |
| --- | --- |
| Documentation wrapper | width `3016`, vertical Auto Layout, Hug height, padding `80` vertical and `120` horizontal, gap `48`, radius `48` |
| Header | width `2776` |
| Component group | width `2776`, vertical Auto Layout, Hug height, gap `12`, no padding, fill, stroke, or presentation radius |
| Group label | shared `DSD - Component Group Label` instance, width `2776` |

The documentation wrapper may explicitly use `Color Semantic / Light` for a
stable review canvas. Do not propagate that mode to every descendant.

## 4. Master-set presentation

Apply this treatment to every master `ComponentSet`:

| Property | Value |
| --- | --- |
| Padding | `48` on all sides |
| Item gap | `32` |
| Row gap | `32` when Wrap is used |
| Radius | `5` |
| Fill | none |
| Stroke | native Figma purple `#9747FF` |
| Stroke weight | `1` |
| Stroke align | Inside |
| Dash pattern | `10, 5` |
| Variable binding | none for presentation styling |

For multiple variants, use horizontal Auto Layout with Wrap, a controlled
width, and Hug height. For a one-child set, Hug/Hug with no wrap is acceptable;
the presentation treatment remains identical.

The 48/32/5/purple treatment belongs only to the `ComponentSet`. Never apply
it to a reusable variant child, nested dependency, or instance.

## 5. Variant matrix

Use variant-property order and child order to make the set read like a table:

- the primary configuration axis, such as `Type`, `Content`, or `Visibility`,
  normally creates rows,
- `State` normally creates columns,
- keep the same state in the same column across complete rows,
- preserve the component family's declared state order; do not guess a global
  order when its Figma or repository contract already defines one,
- place exceptional states in an intentional final row when the component does
  not expose a complete Cartesian matrix,
- do not add fake empty variants merely to fill cells.

Choose the ComponentSet width from the intended number and actual widths of
columns. For equal-width items, use this as a starting point:

```text
set width = 96 + (column count * item width) + ((column count - 1) * 32)
```

Adjust only when the family contract or page width requires it. Verify actual
child bounds after layout rather than relying only on the formula.

## 6. Single-configuration masters

A single-configuration component must preserve the same styling ownership as
a multi-variant component. Its final structure is:

```text
{PascalCaseName}                  COMPONENT_SET
`-- Type=Default                COMPONENT
```

The `ComponentSet` receives all documentation styling. The child retains only
functional padding, gap, fill, stroke, radius, layout, Variables, component
properties, and nested dependencies that belong to real instances.

### Figma UI conversion procedure

When a plain component cannot be styled through a set because no set exists:

1. preserve the canonical component and its bindings,
2. add or duplicate a temporary second variant,
3. create the `ComponentSet`,
4. name the set with the stable PascalCase identity,
5. name the retained child `Type=Default`,
6. remove the temporary child immediately,
7. apply the presentation contract to the set only,
8. re-inspect node IDs because structural conversion may replace them.

The resulting `Type` property has one allowed value, `Default`. It is
structural Figma metadata. Do not map it to an Astro prop, duplicate it into a
registry API, or describe it as a real design option.

### ButtonGroup reference fixture

The established ButtonGroup example uses:

```text
ButtonGroup                       COMPONENT_SET, 310 x 138
`-- Type=Default                 COMPONENT, 212 x 40
```

The set owns padding `48`, gap `32`, radius `5`, no fill, and a `1 px` inside
purple dashed stroke. The child owns no documentation padding or stroke.

## 7. Variable modes and bindings

- Presentation-only geometry and the purple stroke remain raw Figma metadata.
- A preview-only `Component Size` mode belongs on the master set when it is
  needed to display Small, Medium, or Large consistently.
- Preserve a functional mode already owned by the reusable master; do not move
  or duplicate it merely for documentation.
- Do not attach default `Sizing Semantic`, `Typography Foundations`, or
  `Typography Semantic` modes to descendants as documentation decoration.
- Do not change real component Variable bindings while repairing the canvas.

## 8. Audit and leakage gate

For every component group, inspect:

- group name, width, Auto Layout, gap, and child order,
- label main component and its display-name/category properties,
- master node type, name, child count, property definitions, and variant order,
- set padding, gaps, radius, fill, stroke, dash pattern, sizing, and wrap,
- each child component's geometry, strokes, fills, padding, bindings, modes,
  and dependencies.

Fail the group if any reusable child contains documentation-only padding,
purple dashed stroke, presentation fill, or wrapper-sized bounds.

When inspection alone is inconclusive, create a temporary instance from the
inner reusable component and compare its bounds and visible treatment with the
master. Remove the test instance before completing the operation.

## 9. Common failures

- Styling a lone reusable `Component` instead of creating a one-child
  `ComponentSet`.
- Treating the `Component Group` frame as the master-set presentation wrapper;
  it also contains the label and therefore owns a different responsibility.
- Leaving the temporary second variant in the published set.
- Treating `Type=Default` as a meaningful component option.
- Creating a detached documentation copy rather than using the canonical
  reusable master.
- Binding documentation border, padding, gap, or radius to design tokens.
- Rebuilding a correct master when moving presentation styling to the owning
  set would repair the issue.
- Finishing without checking a real instance for documentation-style leakage.

## 10. Completion report

Report:

- page and component groups inspected,
- masters and shared labels reused,
- wrappers created, normalized, or removed,
- one-child sets and their structural property values,
- variant-matrix or ordering changes,
- leakage validation result,
- screenshots checked,
- unresolved deviations and exact node IDs.

Keep the report Figma-only unless the user separately requested Astro,
registry, token, or Git changes.
