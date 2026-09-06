# Footer

Status: active.

- Manifest id: `footer`
- Figma canonical node: none; Astro-only by request
- Figma page key: `footer`
- Astro source: `src/components/website-patterns/footer/Footer.astro`
- Role: `section`
- Sync status: `astro-only`

## UX purpose

Footer closes a page with optional action content, grouped destinations, social links and a supporting legal row in one stable site-wide landmark.

## Communication role

- Goals: navigation

Provide secondary navigation and verified organization information. Keep any subscription promise consistent with the supplied offer.

## Use when

- A page needs the canonical site footer composition.
- Navigation groups, copyright and optional brand or action content must reflow as one unit.

## Avoid when

- The content is a local card or article footer.
- A page needs only an inline legal notice or a standalone newsletter form.

## Content contract

- `copyright` is required authored text and Footer never derives a year.
- `heading` and the `action` slot are optional as a pair; provide both or neither.
- Use the default slot for FooterGroup children and the named `social`, `brand` and `legal` slots only when those regions exist.

## Composition and placement

- Place Footer once at the end of the page shell.
- Use Button or ButtonLink for a simple action and FooterNewsletterForm for email subscription.
- Use LogoAsset inside the brand slot and FooterLink with `variant="legal"` in the legal slot.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: `.l-section`, `.l-container`, the public twelve-column `.l-grid`, auto-fit group columns and wrapping inline clusters.
- Container queries: at an assigned width of `64rem` or wider, an action-enabled Footer gives columns 1–4 to the lead, keeps columns 5–6 as breathing room and starts navigation at column 7; below it both regions span the available width.
- Viewport queries: none.
- Reflow, order and visibility: lead, groups, social links and legal content retain DOM order, remain visible and wrap without alternate markup.

## Accessibility and required behavior

- Render one native `footer` landmark and preserve page-level source order.
- Consumer-selected `headingLevel` must fit the page outline.
- Slotted links and controls retain their own native semantics, accessible names and keyboard behavior.

## Related components

- `FooterGroup`, `FooterLink`, `FooterSocialLink` and `FooterNewsletterForm` provide the family anatomy.
- `Button`, `ButtonLink` and `LogoAsset` are approved slot compositions.

## Naming and token contract

Use `Footer`, `.footer`, global layout/color/size/typography tokens and the approved `footer-size` group. Footer declares no local custom properties and does not expose a theme or tone prop.

## Core decision

Footer owns the site-closing relationship and responsive grid while child components retain link, form and asset semantics.
