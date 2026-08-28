---
name: astro-sync-material-symbols
description: Synchronize a curated Google Material Symbols icon set between an Astro codebase and its Figma library. Use when changing the Material Symbols family (Outlined, Rounded, or Sharp), weight, grade, fill, optical size, curated glyph list, Figma icon-master geometry, color-variable bindings, or local inline-SVG manifest/renderers while preserving Figma master identities and Astro runtime parity.
---

# Astro Material Symbols Sync

Keep Figma masters and Astro inline SVGs as two representations of one
project-owned icon catalog. Use only Google Material Symbols. Never introduce
Lucide, an icon font, Unicode glyphs, runtime Google requests, or pasted SVGs in
consumer components.

## Required context

1. Read the repository's `AGENTS.md` and icon-specific agent rules when present.
2. Locate the project icon manifest, Astro renderers, license, and icon audit.
3. Load `figma-use` completely before every Figma Plugin API call.
4. Read [references/profile-contract.md](references/profile-contract.md) before
   changing style or axes.
5. Read [references/figma-master-contract.md](references/figma-master-contract.md)
   before creating, repairing, or updating a Figma icon master.

Treat the project manifest as configuration. Do not hardcode the current
Starter's file key, page ID, section ID, Variable ID, icon list, or node IDs in
this skill.

## Inputs and defaults

Resolve these values before writing:

- project root;
- Figma file and icon section;
- requested `style`, `weight`, `grade`, `fill`, and `opticalSize`;
- curated glyph list using canonical Google `snake_case` names;
- semantic Figma color Variable;
- Astro manifest and renderer paths.

Preserve unspecified profile values. Preserve the existing curated glyph list
unless the user explicitly adds or removes names. If a required value cannot be
resolved from the project, ask for that value rather than guessing.

Run the bundled validator before fetching geometry:

```bash
node scripts/validate-profile.mjs \
  --style=sharp \
  --weight=400 \
  --grade=0 \
  --fill=0 \
  --optical-size=20 \
  --name=arrow_forward
```

## Workflow

### 1. Audit before writing

- Read the manifest and enumerate its glyphs, profile, source URLs, and Figma
  node IDs.
- Inspect the Figma section, exact masters, group structure, bindings, and
  subscribed instances.
- Verify that every existing master has one canonical name:
  `Icon/Material/<google_snake_case_name>`.
- Record master, group, and vector IDs. Preserve them whenever the nodes exist.
- Select one representative glyph with visibly different family geometry for
  the pilot update. Do not validate a family change only with geometrically
  identical glyphs such as simple plus or minus symbols.

### 2. Resolve official SVG geometry

- Construct the requested profile using the profile reference and the
  validator output.
- Download every glyph from an official Google source. Require an HTTP 200 and
  valid SVG containing at least one path.
- Do not simulate weight with strokes, scale an old glyph into a new optical
  size, round corners manually, or infer one family from another.
- Keep the exact official geometry and Apache-2.0 attribution.
- Fetch all glyphs again after any family, weight, grade, fill, or optical-size
  change; each axis can change the path and its bounds.

### 3. Update Figma in place

- Start with one pilot master and validate it before processing the set.
- Preserve existing Component, Group, and Vector IDs when possible. Replace
  `vectorPaths` on the existing Vector instead of recreating the master.
- Apply the complete master contract from the reference. The group must use
  horizontal `Fill container`, fixed vertical sizing, and locked 1:1 aspect
  ratio so its height follows its filled width.
- Center the official vector inside the optical canvas. Allow vector bounds to
  differ between glyphs; never force every glyph to the same inner width.
- Keep the bounding box as the first child and an alpha mask.
- Rebind the Vector fill to the project semantic icon-color Variable after
  changing geometry.
- Do not add variants, INSTANCE_SWAP, icon-name properties, or consumer-facing
  glyph selection.
- Remove every transient SVG import before returning. Return all mutated and
  transient node IDs from each Figma write.

### 4. Synchronize Astro

- Update provider family and all profile fields in the project manifest.
- Store the same viewBox and path geometry used by Figma.
- Update every official source URL to the selected family and axes.
- Preserve the project renderer API. Render local inline SVG with
  `fill="currentColor"`, an explicit `viewBox`, accessible labeling, and zero
  runtime network or font dependencies.
- Update the icon rule, Figma–Astro sync contract, and icon audit only when
  their asserted profile or master contract changed.
- Do not create per-glyph component files unless the project's explicit
  architecture requires them.

### 5. Validate

Validate Figma:

- expected master count and exact canonical names;
- unchanged IDs for all pre-existing masters;
- fixed optical canvas and `Center / Center` component alignment;
- locked component, group, and vector aspect ratios where required;
- group width `Fill container` and height derived from 1:1 ratio;
- alpha bounding-box mask, centered vector, Scale/Scale constraints;
- semantic color binding on every vector;
- no transient imports, duplicates, missing glyphs, or stale family geometry;
- screenshot of the complete icon section and one visibly changed glyph.

Validate Astro:

- manifest parses and contains only canonical names;
- every source URL matches the requested profile and resolves successfully;
- Figma and Astro path geometry match;
- icon audit, Astro check, and build pass;
- no Lucide packages/imports, icon fonts, or runtime remote assets appear.

Stop and report a blocked result if official geometry is unavailable, a master
cannot be identified safely, or an existing node would need destructive
recreation. Do not commit or push without explicit approval.
