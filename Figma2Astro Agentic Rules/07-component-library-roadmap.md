# Component Library Roadmap

Status: active projection

The Astro public component library is intentionally empty. Figma masters are
the design backlog and are recorded as `figma-only`.

## Current phase

- Preserve existing Figma masters, Variables, Styles, examples, and private
  parts.
- Keep the approved empty Astro family folders with only `.gitkeep`.
- Keep MaterialSymbol as the only active asset renderer.
- Do not generate placeholder component files, README files, or per-component
  rules for empty folders.

## Implementation unit

One user-supplied canonical Figma node link produces at most one scoped
implementation task:

```text
canonical Figma node
→ audit properties, Variables and dependencies
→ implement in the page-mapped Astro folder
→ add component rule
→ update manifest and divergence record
→ validate
→ mapped
```

When several candidate masters represent one future component identity, retain
all candidate node IDs. The user-selected node link decides the canonical
master. Do not auto-select or delete candidates.
