---
status: approved-direction
component: SocialButton and SocialIconButton
owner: maciejpostek
---

# Social Buttons Visual Brief

## Identity

- Astro components: `SocialButton`, `SocialIconButton`
- Family: `buttons`
- Layer: atom
- Figma nodes: none; code-first Astro pilots

## UX Role

Trigger labelled or compact actions whose meaning includes one supported social platform. Navigation to profiles or external URLs is outside this component boundary.

## Brand Principles In Scope

Apply `social-buttons.exact-reuse`: platform identity changes the icon geometry only. Existing Button tokens retain control of hierarchy, color, shape, spacing, states, and focus.

## Approved References

- `align-ui-social-buttons`: adopt separate labelled and icon-only controls plus a leading platform mark; reject provider surfaces, third-party assets, content, API, and raw values.

## Invariants

- Native button semantics and native disabled behavior.
- Existing Button or IconButton geometry and Control Size.
- Monochrome local SocialIcons geometry and token-owned color.
- Stable source order and one DOM rendering across assigned widths.

## Degrees Of Freedom

- Platform selection from the local 26-item catalog.
- Existing button variant and Control Size selections.
- Consumer-authored concise action label.

## Visual Decisions

### Typography

Reuse Button typography without overrides.

### Color

Resolve through the existing Button variant and state aliases. Do not add provider colors or tokens.

### Spacing And Density

Reuse Control Size padding, icon size, and gap aliases.

### Shape, Border, And Surface

Reuse Button and IconButton radius, border, surface, and focus contracts.

### Iconography Or Media

Render `SocialIcons` with `variant="monochrome"`. SocialButton places it before the visible label; SocialIconButton centers it in the square control.

### Motion

No new motion contract.

## States And Variants

- SocialButton: Primary, Secondary, Tertiary.
- SocialIconButton: Primary, Secondary.
- Both: Small, Medium, Large and native default, hover, focus-visible, pressed, disabled states.
- Documentation state controls remain preview-only attributes.

## Responsive Behavior

Use intrinsic sizing without container or viewport queries. Parent composition owns wrapping; content and focus order never change.

## Token Mapping

| Visual decision | Existing token | New token proposal | Component-local optical rule | Approval |
| --- | --- | --- | --- | --- |
| Labelled geometry | `--control-*` | None | None | Approved |
| Labelled icon color | `--button-{variant}-icon-{state}` | None | `--button-icon` alias | Approved |
| Icon-only geometry | `--control-min-height`, `--control-icon-size` | None | None | Approved |
| Icon-only color | `--button-{variant}-icon-{state}` | None | `--icon-button-icon` alias | Approved |

## Evidence

- Reference: `references/align-ui-social-buttons.png`
- Browser routes: `/design-system/base-components/buttons/social-button`, `/design-system/base-components/buttons/social-icon-button`
- Representative platforms: Facebook, X, Instagram, Google, GitHub

## Approval

- Reviewer: maciejpostek
- Date: 2026-08-11
- Status: approved-direction; rendered visual review pending
- Propagation scope: SocialButton and SocialIconButton only
