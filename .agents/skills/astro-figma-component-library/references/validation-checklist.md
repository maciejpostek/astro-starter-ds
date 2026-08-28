# Component family validation

## Per component

- Master name equals the Astro component name.
- ComponentSet exists only when at least two valid variants exist.
- Variant axes and values equal the locked code-derived matrix.
- Variant count equals the Cartesian matrix or documented valid subset.
- Public TEXT, BOOLEAN and INSTANCE_SWAP properties are wired to real children.
- Nested reusable UI is an instance, not copied markup.
- Icons use `Icon/*` instances and retain color overrides after swap.
- All created nodes have stable `dsb` shared plugin data.
- A repeatable-content SLOT is shared across all applicable variants rather
  than duplicated as separate slot properties. The shared key is read from
  `SlotNode.componentPropertyReferences.slotContentId`.
- SLOT defaults use reusable component instances, preferred values are
  intentional, and `limitViolations` is empty. Slot settings and preferred
  values are validated from the ComponentSet property definition rather than
  from the SlotNode.
- SLOT layout, counter-axis stretch and child-count guidance match the parent
  component contract.

## Bindings

- Visible fills and text colors use `Color Semantic`.
- Stroke color and every active edge width are bound separately.
- Padding, gap, radius and component geometry use existing sizing variables.
- Text uses the correct Text Style and Typography Variables.
- Component Size defaults equal Astro defaults.
- Light/Dark is validated through collection modes.
- No raw value replaces an available token.

## Allowed native properties

- auto-layout and grid mechanics,
- transform, blend mode and state opacity,
- media/image content and aspect ratio,
- browser-native or embedded behavior,
- motion,
- Effect Styles for shadows.

## Family checkpoint

- Page name is `Components — {Family}`.
- All expected public masters are present exactly once.
- Private helpers use `_Parts/`.
- No orphan components or broken aliases exist.
- Family Figma2Astro adapter is current.
- Roadmap status is current.
- Full-page screenshot is visually readable.
- Astro build and architecture audit pass at the stable milestone.
