# ButtonGroup

Status: active.

- Manifest id: `button-group`
- Figma canonical node: `204:103`
- Figma page key: `buttons`
- Astro source: `src/components/base-components/buttons/ButtonGroup.astro`
- Role: molecule
- Sync status: mapped

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
- Keep labels distinct and avoid duplicate actions in one group.

## Composition and placement

- Order actions by task priority and preserve that order when wrapping.
- Child count is unrestricted, but large groups should be simplified for comprehension.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: `display: flex`, `flex-wrap: wrap` and `--gap-button-group` preserve a usable group at any allocated width.
- Figma projection: canonical master `204:103` keeps an unrestricted Slot; its internal action slot is `Fill`, uses `Wrap`, and binds both axis gaps to `gap/component/button/group`. Consumer instances use `Fill` only when their parent owns a bounded width.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: Children wrap in DOM order without visual reordering, duplication or hiding; the group does not create a separate mobile variant.

## Accessibility and required behavior

- Render a semantic `role="group"` container and provide an accessible label when context does not already name it.
- Preserve each child’s native focus order and keyboard behavior.
- Do not turn the group into one composite control.

## Related components

- `Button`, `ButtonLink`, `IconButton`, `CopyButton`, `CopyIconButton`, `SocialButton`, and `SocialIconButton` are the preferred children.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Use ButtonGroup when several independent actions form one local choice set; the Slot controls composition, not a fixed child count.
