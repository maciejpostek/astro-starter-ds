# Astro component authoring contract

Use this contract for public reusable component creation, repair, or extension.
Repository-specific machine contracts and Agentic Rules remain authoritative.

## 1. Resolve scope before files

- Run the repository request router and smallest context resolver.
- Identify the primary target, direct dependencies, and context-only records.
- Use `create` only after an explicit reusable/design-system component request.
- Use `extend` for a public API, registry, family, or canonical projection
  change; use `repair` when restoring an existing contract.
- A local page composition stays local unless the user explicitly authorizes a
  public reusable boundary.

For `create`, lock a creation draft before implementation:

- role/layer;
- architecture page/family;
- source directory and PascalCase source path;
- documentation projection;
- resolved token groups;
- direct dependencies;
- canonical Figma identity when supplied.

## 2. Stable identity and placement

- Figma master name, Astro filename, exported component name, registry
  `name`/`astroComponent`, and `data-component-name` use the same stable
  PascalCase identity.
- Place the source under the architecture page folder:
  `src/components/<category>/<page-key>/<Component>.astro`.
- Atomic Design terms are metadata roles, not source-tree folders.
- Every visual reusable component owns or explicitly delegates one stable
  Guides identity.
- Do not encode size, state, tone, or variant in
  `data-component-name`.

## 3. Semantic structure and accessibility

- Choose native HTML from the component's purpose before styling.
- Do not create landmarks that belong to the consuming page or section.
- Separate visual typography from heading rank. Let consumers select semantic
  heading level when the component can appear at multiple outline depths.
- Preserve reading, focus, and DOM order across variants and breakpoints.
- Prefer native labels, groups, dialogs, lists, buttons, and links over ARIA
  reconstruction.
- Decorative assets stay hidden from assistive technology; meaningful state
  must have a text equivalent.

## 4. Public API

- Keep props typed, minimal, bounded, and purpose-driven.
- Required meaning stays required. Do not expose a visibility prop that can
  remove the component's essential semantic anchor.
- Map optional Figma booleans to optional Astro content props or slots when
  presence alone fully represents the behavior.
- Use slots for repeatable or composable child components; do not add Count
  props or fixed child limits.
- Forward safe native attributes from the semantic root.
- Runtime-validate non-empty required strings, closed unions, ranges, and
  relationships that TypeScript alone cannot protect.
- Do not expose documentation controls, internal selectors, arbitrary icons,
  or styling escape hatches as public API.

## 5. Dependencies and composition

- Reuse canonical dependencies and let them own their semantics, tokens,
  spacing, state, and wrapping.
- The parent component may own only the relationship between dependencies.
- Do not copy dependency markup, icons, markers, control profiles, or token
  values into the new component.
- Record dependency-level parity drift instead of overriding a dependency
  locally.
- Registry `dependencies` and `uses` must name real canonical records.

## 6. Tokens and CSS

Resolve each styling need in this order:

1. component-owned semantic token;
2. direct dependency token;
3. approved use-case token;
4. approved global semantic token;
5. primitive only as an approved alias source.

Rules:

- reuse the single semantic match;
- stop on ambiguous matches;
- stop on a gap until an exact `tokenDraft` is approved;
- public components do not declare custom properties;
- do not invent component namespaces, `.ds-*` classes, or magic raw values;
- documentation UI may use its reserved private `.ds-*` namespace;
- finite variants use typed props and stable data attributes.

## 7. Responsive behavior

Choose one primary strategy and record it in the component UX rule:

- `intrinsic` by default for wrapping, fluid sizing, and natural reflow;
- `container` when behavior depends on the component's available width;
- `viewport` only for viewport-owned behavior;
- `alternate` only for an explicitly approved alternate rendering.

Use logical properties, `min-inline-size: 0`, fluid inline sizing, natural
wrapping, and dependency-owned reflow before adding queries. Never duplicate
markup or reorder semantics only for a breakpoint.

## 8. Figma-to-Astro mapping

When a canonical Figma node is explicitly in scope:

- audit the exact master, variants, properties, nested dependencies, variables,
  typography, fixed dimensions, and duplicate masters;
- map Figma variants to closed Astro unions;
- map optional visibility properties to optional content/slots when equivalent;
- keep Figma visual styles independent from Astro semantic heading levels;
- treat Figma fixed canvas widths as representational unless the component
  contract explicitly owns that constraint;
- record intentional differences and dependency drift in the manifest;
- keep Figma canonical for visual composition and Astro canonical for runtime
  semantics, accessibility, behavior, and public API.

## 9. Required projections

A completed public component normally includes:

- Astro source;
- one concise component UX rule using the repository rule schema;
- architecture page/component and Figma contract records where applicable;
- documentation adapter with preview, API, dependencies, and TOC;
- responsive preview adapter when the category supports it;
- generated architecture or page-map projections selected by the repository;
- readiness status: validation reflects executed checks, visual remains
  `review` until human acceptance.

Do not fabricate Astro API or previews for Figma-only records.
