# Component Readiness

Status: active.

This is the canonical code-first Definition of Done for reusable Astro
components. The machine-readable projection is
`architecture/component-readiness-contract.json`. Figma is an explicit,
separate projection and is never a normal completion gate.

## Scope profiles

- **Public component** — a registry-backed reusable component with a public
  source path. It must satisfy all twelve gates, including its canonical
  component rule, documentation, Guides identity, and routed validators.
- **Internal reusable** — a reusable visual component under
  `src/components/_internal`. It needs a typed interface, semantic and token
  compliance, responsive and accessibility behavior, Guides identity, and
  validation. It does not need a public registry record or an individual UX
  rule.
- **Local composition** — page-local markup is not automatically a component.
  It does not need a registry record or Guides identity until it is explicitly
  promoted to a reusable component.

## The twelve readiness gates

### 1. Classification and reuse

Classify the request before editing. Search the component registry and current
source first. Reuse an existing contract when it already owns the requested
responsibility. Creating a page or section does not authorize a public
component.

### 2. Stable identity

Use one PascalCase identity across the filename, public import, registry name,
and `data-component-name`. The Guides identity describes the component, never
its variant, state, size, content, or instance.

### 3. Semantic structure

Start from the correct native element and meaningful source order. Sections
use the canonical `section` → `.l-container` → layout primitive structure.
Never add a wrapper only to satisfy Guides when an existing semantic root can
own or receive the identity.

### 4. Typed API

Keep props explicit, typed, and minimal. Use slots for composable content,
`data-*` attributes for finite visual variants, and native HTML state such as
`disabled`, `checked`, `required`, `readonly`, and `aria-*`. Do not expose a
documentation-only state as a public prop.

### 5. Variables and tokens

Consume existing semantic or component CSS variables for color, typography,
sizing, spacing, radius, border, and motion. Do not replace an existing token
with a local raw value. A new public token requires a separate explicit design
system extension.

### 6. Responsive behavior

Follow `.agentic-rules/09-responsive.md`: semantics and fluid foundations,
then intrinsic layout, then a component-owned container query, then a
viewport query, then a controlled alternate layout. Every public component
rule contains the complete `Responsive behavior` contract. Validate overflow,
wrapping, source order, and assigned-container widths from 320 to 1440 px.

### 7. Accessibility

Provide the correct accessible name, keyboard operation, focus-visible state,
roles, and native disabled or validation behavior. Responsive reflow must not
break reading order or focus order. State changes that require announcement
must expose that state to assistive technology.

### 8. UX and content contract

A public component renders its canonical Markdown rule directly in the design
system documentation. The rule defines UX purpose, use and avoid conditions,
content, composition, responsive behavior, accessibility, related components,
and the core decision. It does not duplicate implementation details already
owned by source or token files.

### 9. Dependencies and composition

Dependencies use real registry identities. Documentation explains why each
dependency is used and links to its canonical documentation. A component does
not duplicate the responsibility of a dependency it already composes.

### 10. Documentation

An implemented Base Component or Website Pattern has metadata, one canonical
interactive preview, API, typed dependencies, and its rendered UX rule.
Component metadata deep-links to canonical semantic color groups in
Foundations; component pages do not duplicate Foundation variable tables.
Documentation reuses the shared table, copy, and link resolver components.
Standard documentation routes use the canonical
`DesignSystemLayout` → `DsDocHeader` → page content slot anatomy; pages do not
render their own header, width wrapper, or page-level maximum width. The page
has exactly one `h1` from `DsDocHeader`; structural sections follow the
canonical `DsSectionHeaderLevel2` → `DsSectionHeaderLevel3` →
`DsSectionHeaderLevel4` hierarchy without skipped levels or page-local heading
spacing and dividers. A Figma-only record must not receive fictional Astro
preview or API data.

### 11. Guides

Every visual reusable `.astro` component exposes one stable
`data-component-name`. Owned roots set it directly. Conditional roots repeat
the same identity. A pass-through wrapper delegates an internal
`componentName` to the canonical child root. Multi-root output assigns the
same identity to each alternative primary root and may use
`data-component-part` for secondary elements. Nested inspection resolves the
closest named component.

### 12. Validation

Run `npm run audit:component-readiness` plus only the family and scope audits
selected by the router. Run browser validation for visual, interactive, or
responsive changes. Set `readiness.validation` to `passed` only after the
required checks succeed. Figma parity is not one of these checks.

## Result contract

A component change reports the task intent, reused and created identities,
changed files, readiness gates covered, validators run, and any missing input.
The tracked registry stores current readiness only; Git owns history.
