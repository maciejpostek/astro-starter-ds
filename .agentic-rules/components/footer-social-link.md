# FooterSocialLink

Status: active.

- Manifest id: `footer-social-link`
- Figma canonical node: none; Astro-only by request
- Figma page key: `footer`
- Astro source: `src/components/website-patterns/footer/FooterSocialLink.astro`
- Role: `atom`
- Sync status: `astro-only`

## UX purpose

FooterSocialLink navigates to one approved social-platform destination with either an icon-only or icon-and-label presentation.

## Communication role

- Goals: navigation

Provide secondary navigation and verified organization information. Keep any subscription promise consistent with the supplied offer.

## Use when

- A footer links to an organization's social profile or channel.
- Compact and labelled presentations must share one semantic anchor contract.

## Avoid when

- Activation performs an in-page social action; use SocialButton or SocialIconButton.
- The required platform is absent from the approved SocialIcons catalog.

## Content contract

- `href`, approved `platform` and non-empty `label` are required.
- `icon-only` uses `label` as the anchor's accessible name; `labelled` renders it visibly.

## Composition and placement

- Place in Footer's social slot or a FooterGroup.
- SocialIcons renders the fixed monochrome platform geometry and remains decorative inside the named anchor.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: fixed `--footer-social-icon-size`, inline-flex alignment, natural label wrapping and parent-owned clusters.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: icon and optional label retain source order; icon-only never swaps to a second mobile rendering.

## Accessibility and required behavior

- Render a native anchor, never SocialIconButton, for profile navigation.
- Every icon-only link receives the required authored accessible label.

## Related components

- `SocialIcons` supplies the approved platform mark.
- `FooterGroup` or Footer's social list owns collection semantics.

## Naming and token contract

Use `FooterSocialLink`, `.footer-social-link`, `data-footer-social-link-presentation` and the approved `footer-size` group. Do not introduce provider colors or arbitrary SVG slots.

## Core decision

Use FooterSocialLink for social navigation and reserve social buttons for actions.
