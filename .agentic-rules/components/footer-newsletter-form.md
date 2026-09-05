# FooterNewsletterForm

Status: active.

- Manifest id: `footer-newsletter-form`
- Figma canonical node: none; Astro-only by request
- Figma page key: `footer`
- Astro source: `src/components/website-patterns/footer/FooterNewsletterForm.astro`
- Role: `molecule`
- Sync status: `astro-only`

## UX purpose

FooterNewsletterForm collects one required email address and submits it through a native POST form without owning a provider integration.

## Communication role

- Goals: navigation

Provide secondary navigation and verified organization information. Keep any subscription promise consistent with the supplied offer.

## Use when

- Footer's action region offers newsletter subscription.
- A server endpoint can accept a conventional email form submission.

## Avoid when

- Subscription requires client-side queueing, retries or provider-specific response handling.
- The form collects more than an email and optional consent content.

## Content contract

- `id`, `action`, `emailLabel` and `submitLabel` are required.
- `emailName` defaults to `email`; placeholder copy is optional and never replaces the visible label.
- The optional `consent` slot may contain the applicable consent text and policy link.

## Composition and placement

- Place in Footer's action slot alongside Footer's paired heading.
- FormField owns label/control structure, Input owns native email entry and Button owns submission emphasis.

## Responsive behavior

- Primary strategy: `container`
- Mechanisms and references: fluid Input, a minmax form grid, full-width narrow submit allocation and token-backed gaps.
- Container queries: below `24rem` of assigned width the email field and submit button use one column; from `24rem` they share one row with an intrinsic-width submit button.
- Viewport queries: none.
- Reflow, order and visibility: label, email control, submit button and optional consent keep DOM and focus order while the controls reflow vertically when horizontal space is insufficient.

## Accessibility and required behavior

- Render a native `form method="post"`, required `input type="email"` and `button type="submit"`.
- Keep FormField's visible label connected to the generated input id.
- Browser validation remains native; backend result messaging is consumer-owned.

## Related components

- `FormField`, `Input` and `Button` are direct dependencies.
- `Footer` owns placement and the paired action heading.

## Naming and token contract

Use `FooterNewsletterForm`, `.footer-newsletter-form` and dependency/global token groups. Do not add JavaScript, provider endpoints or newsletter-specific color tokens.

## Core decision

FooterNewsletterForm standardizes accessible email submission anatomy while leaving delivery and response handling to the consuming application.
