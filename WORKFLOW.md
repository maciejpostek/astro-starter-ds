# Astro Design System Workflow

This workflow keeps iteration fast and system-oriented. The goal is to avoid
local CSS drift, duplicated UI patterns, and unnecessary full builds during
visual exploration.

## Strategic Framework Assumptions

The strategic assumptions for the AI-native Astro design system live in
`DESIGN-SYSTEM-FRAMEWORK.md`. Treat that file as the decision record for why
this repo uses token-first CSS, Astro components, attribute APIs, restrained
utilities/layout classes, and agentic Markdown instead of making Tailwind the
architectural source of truth.

## Micro-Change Protocol

Use this mode for simple visual/content edits such as changing copy, adding a
small text block, changing one color, adjusting one spacing value, or applying
an existing class.

Rules:

1. Make the smallest direct edit first.
2. Do not run `npm run build` unless the change touches imports, component
   props, or Astro syntax that is likely to break.
3. Do not inspect broad files or search the whole app when the target is
   already clear from the user's message.
4. Do not update documentation for a micro-change unless the user asks or a new
   reusable rule/component is introduced.
5. Prefer one concise working update and one concise final message.
6. Use `apply_patch` directly after locating the exact file/selector.
7. For CSS-only edits, verify with a narrow `rg`, `sed`, or no command when the
   patch context is enough.

Speed targets:

- Text/content or one CSS property: under 60 seconds.
- Existing component prop/class change: under 90 seconds.
- New tiny atom or utility: under 3 minutes, build only if Astro imports change.

If the user writes `szybka zmiana`, `bez builda`, or the request is clearly a
micro-change, follow this protocol automatically.

## Default Editing Protocol

1. For brand, content, information architecture or page work, read the relevant
   files in `project-context` first.
2. For brand-sensitive visual work, also read `art-direction/README.md`,
   `.agentic-rules/08-brand-expression.md`, and the project Brand Expression
   Contract. Treat any state other than `approved` as an input gap.
3. Identify the target section or component.
4. Check `COMPONENTS.md` and `src/components` for an existing reusable pattern.
5. If the change affects an existing component, update the component globally.
6. If markup is repeated or likely to repeat, extract a component before
   styling it.
7. Reuse atoms inside larger components.
8. Use semantic tokens before primitive tokens.
9. Keep component CSS close to the component.
10. Use targeted verification first.
11. Run a full build only after larger batches or structural changes.

## Brand-Sensitive Visual Protocol

Use this protocol when a task asks for a visual language, art direction,
project-specific styling, or a new composition derived from supplied branding.

```text
supplied brand evidence
→ reference manifest with adopt / avoid notes
→ Brand Expression Contract
→ token and component mapping
→ browser exploration
→ human visual review
→ accepted Astro implementation
→ Figma representation
→ parity evidence
```

Rules:

1. Separate universal design knowledge from project-specific decisions.
2. Translate subjective words into observable properties and counterexamples.
3. Use at least one supplied reference or approved designed sample for every
   material visual-direction claim.
4. Record which concern each reference applies to: composition, grid,
   typography, color, spacing, shape, surface, component DNA, imagery, or
   motion.
5. Build one representative calibration fixture before changing an entire
   component family.
6. Prefer existing tokens and components. If the approved direction cannot be
   expressed, revise the token or component contract explicitly.
7. Validate hierarchy, contrast, balance, rhythm, unity, responsive behavior,
   and accessibility.
8. Require human approval for subjective visual quality.
9. Synchronize the accepted code result to Figma; do not use Figma page names
   as technical mapping keys.

## Feedback Contract

When interpreting user feedback, assume global/systemic intent unless the user
explicitly says the change is local.

Useful labels in feedback:

- `global` - update the master component or token.
- `local` - update only this section/instance.
- `component` - work in `src/components`.
- `section` - work in the page/section layout.
- `token` - update the design token layer.
- `desktop only` - do not spend time on responsive behavior yet.
- `responsive` - include breakpoint behavior.

If the feedback references a reusable object, such as button, tag, card, input,
section header, avatar, CTA, or label, inspect the component first.

During visual review, use the component info layer in the browser to identify
the exact component name before making changes. Component labels come from
`data-component-name` on reusable component roots.

## Verification Strategy

Use the smallest useful check for the change:

- Content or CSS-only component update:
  - inspect files with `rg` / `sed`
  - run `git diff --check`
- Astro component API or import changes:
  - run `npm run build`
- Bigger batch or handoff milestone:
  - run `npm run build`
  - verify the dev server URL if the user needs live preview

Avoid restarting the dev server unless it is down or the user needs a fresh URL.

## Dev Server Strategy

Preferred local command:

```bash
npm run dev -- --host 127.0.0.1 --port 4325
```

If the port is busy, use the port Astro prints in the terminal. Keep the server
running across iterations when possible.

Do not spend time restarting the server after every small CSS/component change;
Astro/Vite hot reload should pick up edits.

## Build Strategy

Do not run full builds after every micro-change. Run `npm run build` when:

- imports or Astro component props changed in a non-trivial way,
- a larger section/component batch is finished,
- before calling a version stable,
- before asking the user to evaluate something as a milestone.

For small visual edits, `git diff --check` is usually enough.

## Component Creation Rules

Create or reuse components in this order:

1. Atom - single primitive UI element, such as button, tag, label, input,
   eyebrow, avatar image.
2. Molecule - small composition of atoms, such as button group, section header,
   form field group, profile avatar.
3. Card - reusable content container with defined props, such as field card or
   project card.
4. Section - only when the whole section is repeated or complex enough to
   deserve its own component.

Do not create one-off components for every tiny layout wrapper. Componentize
repeated patterns and meaningful UI decisions.

When creating a reusable component, add `data-component-name` to its root
element and document it in `COMPONENTS.md`.

## Styling Rules

- Component state and variants belong in the component file.
- Section-level grids and page composition can stay in `global.css` until a
  section becomes a component.
- Use component attributes like `data-component-size` for size variants when
  the same component needs `tiny`, `small`, `medium`, or `large`.
- Use shared spacing tokens for repeated relationships, such as button gaps,
  tag gaps, section-header-to-content spacing, card internal spacing, and
  media-to-content spacing.
- Avoid creating local spans that visually mimic tags, labels, or buttons.

## Documentation Updates

Update `COMPONENTS.md` when:

- a new reusable component is created,
- a component gets a new variant,
- a component usage rule changes,
- a pattern is identified as backlog for componentization.

Update `VARIABLE-ARCHITECTURE.md` or `src/styles/tokens/README.md` when:

- token architecture changes,
- a new semantic token family is introduced,
- a token usage rule becomes part of the design system.

## Git Rules

- Work locally until the user approves a push or commit.
- Do not push to `main` without explicit approval.
- Use branches to preserve design exploration history when the user asks for
  a new exploration path or milestone.
