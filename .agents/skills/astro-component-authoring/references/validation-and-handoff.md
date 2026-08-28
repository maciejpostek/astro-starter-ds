# Validation and handoff

Use repository-selected validators. Do not substitute a full validation suite
for scoped checks unless the creation/readiness contract requires it.

## Validation sequence

For a new or materially changed public component, normally verify:

1. request route and resolved context are ready;
2. architecture manifest and generated page map are current;
3. component authoring audit passes;
4. component readiness audit passes;
5. documentation audit passes;
6. responsive strategy audit passes;
7. the matching family audit passes when one exists;
8. Astro check and production build pass;
9. runtime visual review covers canonical variants, optional parts, narrow
   width, overflow, semantic heading structure, accessible relationships, and
   console errors.

Use the exact scripts declared by the repository. In an AI-Native V1.1 Astro
repository these commonly include:

```sh
npm run audit:components
npm run audit:component-authoring
npm run audit:component-readiness
npm run audit:documentation
npm run audit:responsive
npm run audit:architecture
npm run figma-pages:check
npm run build
```

Run generated projections before their corresponding `--check` command when
the source registry changed. Do not run broad generators that overwrite
unrelated dirty-worktree changes without first understanding their outputs.

## Runtime review

For visual, responsive, or interactive changes:

- open the canonical documentation page;
- verify singleton or multi routing and sidebar shape;
- inspect default and bounded variants;
- verify optional parts collapse without removing essential semantics;
- test a narrow 320px-equivalent viewport and a normal desktop viewport;
- confirm no horizontal overflow or changed reading/focus order;
- inspect accessible names, heading levels, and console errors.

Browser inspection proves implementation behavior but does not grant human
visual approval.

## Readiness states

- Set `readiness.validation=passed` only after every required validator passes.
- Keep `readiness.visual=review` until the user accepts the runtime result.
- Use `failed` or `partial` honestly when checks do not complete.
- A known Figma/Astro drift may produce `ready-with-conditions`; record the
  exact difference and do not hide it with a local override.

## Final handoff

Report:

- verdict: `ready`, `ready-with-conditions`, or `blocked`;
- canonical identity, category, family, source path, and documentation URL;
- public props, slots, variants, dependencies, and semantic root;
- changed registry, rule, preview, and generated projection files;
- validators and runtime widths exercised;
- intentional Figma/Astro differences;
- remaining risks and visual-review status;
- the next user decision.

Do not claim unrelated dirty-worktree changes as part of the component task.
