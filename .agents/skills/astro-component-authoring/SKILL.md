---
name: astro-component-authoring
description: Create, repair, extend, or normalize reusable Astro design-system components and their registry-backed documentation, including deterministic singleton-versus-family routing. Use for public component implementation, Figma-to-Astro handoff, component readiness, or documentation organization; do not use for local page-only compositions.
---

# Astro Component Authoring

Build one reusable component contract across Astro source, dependencies, tokens,
registry records, documentation, responsive behavior, Guides identity, and
validation. Treat repository rules as canonical; this skill supplies the
repeatable workflow and routing decisions that connect them.

## Start with repository authority

Before changing a component or its documentation:

1. Read the nearest `AGENTS.md`.
2. Read `AGENTIC-RULES.json` and run the repository router/context resolver.
3. Classify the request as `exact-edit`, `reuse`, `compose`, `repair`,
   `extend`, or `create`.
4. Preserve unrelated work in a dirty worktree.

Public component creation remains explicit-only. A section or page composition
does not authorize a new public component, token, registry record, or API.

## Select the required guidance

- For component creation, repair, or extension, read
  [references/authoring-contract.md](references/authoring-contract.md) fully.
- When registry, Guides, URLs, navigation, previews, search, or family pages are
  affected, read
  [references/documentation-routing.md](references/documentation-routing.md)
  fully.
- Before claiming completion, read
  [references/validation-and-handoff.md](references/validation-and-handoff.md)
  fully.

For a user-supplied canonical Figma node, also use
`figma-to-astro-component`. Load `figma-use` before every `use_figma`
operation. Figma remains explicit-only and does not broaden the requested
Astro scope.

## Repeatable decision sequence

1. Resolve the canonical component identity, architecture page, source folder,
   role, dependencies, and existing alternatives.
2. Reuse the single semantic dependency match. Stop on ambiguity.
3. Resolve styling through component → dependency → use case → global →
   primitive token aliases. A token gap requires an exact approved
   `tokenDraft` before CSS or token sources change.
4. Lock the minimal typed API, semantic root, accessibility contract,
   responsive strategy, and optional composition slots.
5. Implement without local custom properties, invented namespaces, duplicated
   dependencies, or documentation-only public props.
6. Update the manifest, component UX rule, documentation adapter, preview, and
   route projections in the same change.
7. Classify the documentation page as `empty`, `singleton`, or `multi`
   from the active public component count. Then apply the canonical Astro
   presentation: `empty` is a heading-only placeholder, `singleton` is the
   direct component detail page, and `multi` in Base Components or Website
   Patterns is a non-clickable sidebar disclosure with direct child pages and
   no family gallery.
8. Run only the validators selected for the affected scope, plus visual runtime
   review when layout, responsive behavior, or interaction changed.

## Stop conditions

Stop and report the exact blocker when:

- public creation was not explicitly requested;
- reuse resolution is ambiguous;
- a styling need has no approved token alias or token draft;
- the planned source is outside the registered architecture family;
- a canonical Figma dependency or identity is missing;
- implementation would require a breaking API, family move, or unrelated
  external mutation not authorized by the user.

Do not mark visual readiness `approved` without human runtime acceptance.
