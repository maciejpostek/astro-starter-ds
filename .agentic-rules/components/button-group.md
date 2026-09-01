# ButtonGroup

Status: active.

- Manifest id: `button-group`
- Figma canonical node: `204:103`
- Figma page key: `buttons`
- Astro source: `src/components/base-components/buttons/ButtonGroup.astro`
- Role: molecule
- Sync status: intentional-difference

## UX purpose

Organize related actions into one clear decision area while preserving each child action’s own semantics and emphasis.

## Use when

- Two or more Buttons, ButtonLinks, IconButtons, CopyButtons, CopyIconButtons, SocialButtons, or SocialIconButtons belong to the same local task.
- Actions need consistent spacing and responsive wrapping.

## Avoid when

- Actions are unrelated or belong to different sections.
- A single Button is sufficient.

## Content contract

- Use the default slot for complete interactive components only.
- `align` accepts `left` or `centered`; `left` is the backward-compatible default and follows the logical inline start in the current writing direction.
- Keep labels distinct and avoid duplicate actions in one group.

## Composition and placement

- Order actions by task priority and preserve that order when wrapping.
- The consuming parent positions the ButtonGroup as one allocation. ButtonGroup owns the alignment of children within every wrapped line through `data-button-group-align`.
- A centered parent that exposes a shared alignment contract must pass `align="centered"` explicitly instead of overriding ButtonGroup internals with a descendant selector.
- Child count is unrestricted, but large groups should be simplified for comprehension.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `display: flex`, `flex-wrap: wrap`, `justify-content: flex-start | center`, `data-button-group-align` and `--gap-button-group` preserve a usable group at any allocated width.
- Figma projection: canonical master `204:103` keeps an unrestricted Slot; its internal action slot is `Fill`, uses `Wrap`, and binds both axis gaps to `gap/component/button/group`. It has no approved alignment axis, so Astro's `left | centered` prop remains an intentional code-only difference. Consumer instances use `Fill` only when their parent owns a bounded width.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: Children wrap in DOM order without visual reordering, duplication or hiding. Every wrapped line follows the selected alignment, and the group does not create a separate mobile variant.

## Accessibility and required behavior

- Render a semantic `role="group"` container and provide an accessible label when context does not already name it.
- Preserve each child’s native focus order and keyboard behavior.
- Do not turn the group into one composite control.

## Related components

- `Button`, `ButtonLink`, `IconButton`, `CopyButton`, `CopyIconButton`, `SocialButton`, and `SocialIconButton` are the preferred children.

## Naming and token contract

Use `ButtonGroup`, `.button-group`, `data-button-group-align`, the closed `left | centered` variant and the registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. Alignment uses the native flex contract and creates no token need. A confirmed styling gap still requires an approved `tokenDraft` before implementation.

## Core decision

Use ButtonGroup when several independent actions form one local choice set; the Slot controls composition, `align` controls every line, and no fixed child count is introduced.
