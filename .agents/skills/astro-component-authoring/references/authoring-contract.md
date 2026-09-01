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

### Missing project visuals

Missing project media does not block page or section composition. Keep the
approved visual geometry with the canonical CSS checkerboard and place
`data-visual-placeholder="missing-asset"` on a local placeholder node. Do not
add a public placeholder prop or change the reusable component API.

Do not invent, generate, download or select replacement media without explicit
authorization. Complete the remaining composition and collect one structured
asset request per visible placeholder: route and component location, purpose,
expected aspect ratio, informative or decorative intent, and the direct
question the user must answer. The composition can be handed off with these
requests, but release readiness remains incomplete until real media replaces
every missing-asset marker and informative media has suitable alternative text.
An intentional checkerboard in design-system documentation or a test fixture
does not create an asset request.

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

## 9. Documentation preview layout

Documentation presents one representative canonical use case per component by
default. That specimen should be sufficient to understand the component's
purpose, composition and primary behavior. Do not create separate preview
sections for minimum-valid anatomy, content growth, localization, RTL, stress
data, or additional use cases unless the user explicitly asks for those
documentation surfaces.

Keep resilience and edge-case coverage in automated tests rather than exposing
every test fixture as documentation UI. Documentation examples use English or
Polish only; do not introduce other languages or RTL/localization specimens
without an explicit request. Internal preview components may still support the
minimum private inputs needed by the one canonical adapter, but must not grow a
mode API solely to render extra documentation cases.

Every Astro-backed Website Pattern documentation preview must declare one
documentation-only container profile:

- `full` when the component owns its site padding or inner container and is
  intentionally composed against the full viewport width;
- `main` when the consuming page is expected to provide the main site
  container;
- `small` when the component contract intentionally uses the approved narrow
  reading container.

Resolve ownership from the component root, layout CSS and component UX rule.
Never infer the profile only from its category, Atomic Design layer or role.

It must also declare one specimen sizing mode:

- `fill` when the component is a section or horizontal pattern intended to
  consume the full width of the selected documentation container;
- `bounded` when the public root is fluid but the pattern is normally placed
  in a card or column-sized allocation and must remain centered within the
  preview canvas;
- `intrinsic` when the component owns a natural content-driven width and the
  preview must not force it to fill the selected container.

Resolve sizing from the component's allocation contract, not from a `Card`
name, Atomic Design role or fixed Figma fixture width. The private preview
frame owns container width, specimen width and centering; never add preview
width, padding, max-width or a documentation prop to the public component.
Inline, dialog and `/preview` projections must consume the same adapter values.

Website Patterns also resolve one documentation presentation independently of
their container and sizing classifications:

- `standard` renders only the canonical 4:3 interactive preview used by Base
  Components. It does not expose Scale and does not generate a standalone
  `/preview` route;
- `responsive` keeps the same inline preview and additionally exposes Scale,
  the shared responsive canvas and its standalone `/preview` route.

Use `standard` when the regular scene is sufficient to inspect an intrinsic or
bounded pattern and a viewport-level canvas adds no meaningful responsive
evidence. Use `responsive` when section composition, container behavior,
breakpoints or viewport-width reflow are part of the component's contract. Do
not infer the presentation solely from the Website Patterns category, Atomic
Design role, component name, `container` profile or `sizing` mode. Resolve an
explicit user request for standard-only or responsive preview exactly. The
presentation belongs to the canonical documentation adapter and must never
become a public component prop. `responsivePreview` remains only an optional
renderer-props override for a responsive presentation; its presence is not the
enablement policy.

## 10. Required projections

A completed public component normally includes:

- Astro source;
- one concise component UX rule using the repository rule schema;
- architecture page/component and Figma contract records where applicable;
- documentation adapter with preview, API, dependencies, and TOC;
- responsive preview adapter only when the canonical preview presentation is
  `responsive`;
- generated architecture or page-map projections selected by the repository;
- readiness status: validation reflects executed checks, visual remains
  `review` until human acceptance.

Do not fabricate Astro API or previews for Figma-only records.
