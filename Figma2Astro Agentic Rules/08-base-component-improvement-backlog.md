# Base Component improvement backlog

This file records non-blocking follow-up work discovered during the 2026-08-13
Figma Base Components synchronization. Items here are not permission to change
public APIs, create tokens, or delete compatibility layers.

## Breaking migrations

- Checkbox `219:110` and Radio `220:80` retain hidden legacy `Label`,
  `Description`, and `Show Description` properties. Their visible mastery is a
  bare control, but removing the old properties would break existing Figma
  instances. Plan a named-version checkpoint and an explicit instance migration
  before deleting them.
- `_Legacy/Fieldset` `511:204` and `_Legacy/Form` `225:455` remain quarantined
  on Form Structure. They are not Astro public components and should be removed
  only after confirming that no product files depend on them.

## Representation gaps

- Pagination First and Last currently use `arrow_back` and `arrow_forward`
  because the curated Material Symbols subset has no dedicated boundary glyphs.
  A future icon-library synchronization can add exact glyphs without changing
  Pagination semantics.
- TabMenu, PaginationGroup, and Pagination remain finite design-time fixtures
  in Figma. Tabs uses an unrestricted Tab-only native Slot that matches the
  Astro default-slot composition; Astro remains canonical for keyboard
  behavior, focus management and external panel visibility.
- Figma's remote Plugin API cannot create a named Version History checkpoint.
  Auto-history was preserved, but named checkpoints still require a manual
  Figma Desktop action.
- The existing Graphik page-order debt remains unchanged because the unavailable
  font blocks safe in-place reparenting of preserved legacy frames.

## Automation opportunities

- Promote `scripts/sync-figma-base-component-contracts.mjs` into a read/write
  exporter fed directly by a versioned Figma snapshot instead of maintaining
  node contracts by hand.
- Add a Figma audit that fails when a public mastery is duplicated, lacks its
  canonical 2700/2460 canvas, introduces an unbound authored color, or exposes
  an unrestricted Material Symbol swap.
- Add screenshot-diff baselines after the user approves the current `review`
  set. Approval should update only `readiness.visual`; it must not rewrite
  component contracts.
- Extend the live Figma audit from node presence to anatomy parity: intrinsic
  sizing, required child roles, property references, typography styles and
  exact variable IDs. The previous structural check did not detect the 100 px
  Hint, the duplicate FormField message or the loose UrlInput protocol text.
- Reject color bindings applied to an entire Material Symbol `INSTANCE`.
  Consumer-scoped icon color must bind the internal vector glyph (or a private
  state-scoped icon component); binding the instance paint creates a visible
  rectangular background and should fail QA.
- Add a projection-difference assertion for APIs such as Breadcrumb: Figma may
  intentionally show only the canonical default while Astro retains temporary
  compatibility values. The validator should require a divergence record
  instead of forcing either environment to imitate the other.
