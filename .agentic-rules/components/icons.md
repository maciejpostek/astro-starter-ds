# Component Agentic Rule: Icons

Status: active.

Use this file whenever an agent selects, adds, replaces or transfers an icon
between Figma and Astro.

## 1. Canonical source

- Astro icon package: `@lucide/astro`
- Figma library naming: `Icon/<LucidePascalName>`
- Default optical canvas: `24 × 24`
- Component family: `assets/icons`

The icon name must stay compatible with the named Lucide Astro export. For
example:

```text
Figma Icon/ArrowDownRight
  -> import { ArrowDownRight } from "@lucide/astro"
  -> <ArrowDownRight />
```

The Figma library is curated to the icons used by the starter. It is not a local
fork of the complete Lucide package.

Machine-readable catalog:
`src/data/design-system/iconLibrary.json`.

## 1.1 Licensing

- The installed `@lucide/astro` package uses the ISC license.
- The canonical local evidence is `node_modules/@lucide/astro/LICENSE`.
- Lucide identifies a subset of Feather-derived glyphs under the MIT license in
  the same file.
- Preserve the applicable copyright and permission notices when distributing
  Lucide source or copied icon assets.
- Do not infer licensing from a glyph name or a website screenshot. Validate
  against the installed dependency used by the build.

## 2. Selection rules

- Reuse a local Figma `Icon/*` component before drawing a new glyph.
- Use instance swap for icon choice inside reusable Figma components.
- In Astro, use a named `@lucide/astro` import and render the icon through the
  public component slot.
- Keep one semantic meaning per icon within a local interaction context.
- Prefer common, recognizable glyphs. If the meaning is ambiguous, use a
  visible text label instead of inventing a decorative symbol.

## 3. Naming and accessibility

- Preserve canonical PascalCase Lucide naming after the `Icon/` prefix.
- Aliases used only for local import readability do not create new Figma
  components. `Grid3x3 as Grid` still maps to `Icon/Grid3x3`.
- Standalone decorative icons use `aria-hidden="true"` in Astro.
- Interactive accessible names belong to `Button` or required
  `IconButton.label`; they do not come from the glyph name.
- Do not use an icon component name as user-facing accessible copy.

## 4. Styling contract

- Icon geometry stays inside the `24 × 24` Lucide view box.
- In Figma the glyph container must stay optically centered and scale with the
  outer icon instance. Use centered alignment plus Scale constraints (or an
  equivalent responsive vector contract); never leave a fixed 24 × 24 glyph
  inside a resized outer frame.
- The consuming component controls rendered size through
  `--component-icon-size` or another documented semantic size token.
- Standalone Figma icons bind their visible color to
  `Color Semantic / Global/icon/primary`.
- Component masters may recolor an icon through their own
  `Component/*/icon/*` token contract. Do not create icon-specific color
  variables for a single consumer.
- Do not modify Lucide path geometry to compensate for layout spacing. Fix the
  container, gap or size instead.

## 5. Forbidden shortcuts

- Do not paste raw SVG paths into Astro templates.
- Do not use emoji or Unicode arrows as interface icons.
- Do not detach Figma icon instances merely to change color or size.
- Do not create a variant axis containing every icon name. Icon choice is an
  instance-swap property.
- Do not add the full Lucide catalog to the starter without a real use case.

## 6. Validation

- Figma component name maps to a real `@lucide/astro` named export.
- Every named Lucide import under `src` exists in
  `src/data/design-system/iconLibrary.json` and has one permanent Figma node ID.
- The catalog currently contains 51 curated icons: 43 required by named source
  imports and eight retained for deliberate instance-swap composition.
- The component remains swappable and is not detached.
- Its containing component supplies the accessible name where required.
- Size and color come from the consuming component contract.
- Resizing the icon instance preserves equal optical insets on both axes; the
  glyph is not shifted by a fixed inner frame.
- New icons are added to the curated Figma library and this rule is updated
  only if the mapping contract changes.
- Run `npm run audit:icons` after adding, removing or renaming an icon import or
  Figma asset record.
