---
status: approved
last-approved-at: 2026-08-11T10:51:44Z
---

# Project Component Signatures

When the Brand Expression Contract reaches `review`, document the calibration
set below. Use `art-direction/templates/component-visual-brief.md` for each
major redesign.

## Button

Not configured.

## Social Buttons

- Invariants: SocialButton follows Button geometry; SocialIconButton follows IconButton geometry; both use one leading local SocialIcons mark.
- Permitted variation: approved platform, inherited button variant, Control Size, native state, and consumer-owned action label.
- Color: surfaces, borders, text, and icons resolve exclusively through the existing Button variant and state variables.
- Iconography: `SocialIcons` is fixed to `monochrome`; its parent owns `currentColor` and `--control-icon-size`.
- Accessibility: SocialButton uses visible label content; SocialIconButton requires an explicit action label mapped to `aria-label`.
- Responsive behavior: one intrinsic DOM representation with stable source and focus order; the parent owns group wrapping.
- Propagation: approved only for `SocialButton` and `SocialIconButton` in the Buttons family.

## Input Or FormField

- FileUpload invariant: native file semantics, fixed upload icon, visible label and status, local Browse Button and no transport ownership.
- FileUpload variation: hint, accepted types, single or multiple selection, client size limit and authored invalid message.
- FileUploadCard invariant: fixed description and close icons, explicit status text, native progress while uploading and controlled action events.
- FileUploadCard variation: uploading determinate or indeterminate, success, error, byte metadata, format label and localized labels.
- Responsive behavior: fluid FileUpload and container-aware FileUploadCard preserve DOM order and wrap without overflow.
- Propagation: approved only for the File Upload family.

## Tag

Not configured.

## SectionHeader

Not configured.

## Representative Card

FileUploadCard is the approved representative compact status card for this pilot. Its visual readiness remains `review` pending browser acceptance.

## Representative Hero Or Section

Not configured.

## Popup

- Invariants: one native modal surface, fixed semantic status glyph, required title and description, Confirm action and native full-viewport backdrop.
- Permitted variation: error, warning, success or info; horizontal or vertical copy alignment; optional Cancel and preference; dismissible or action-only close.
- Color: surface, border, text, status and overlay resolve exclusively through approved global semantic tokens; the overlay is black at 20% in both themes.
- Composition: canonical Button, ButtonGroup, CheckboxLabel and MaterialSymbol remain separate dependencies with unchanged public contracts.
- Accessibility: unique title and description relationships, textual status meaning, bounded dismissal, deterministic initial focus and focus restoration.
- Responsive behavior: a fluid panel capped at 440 px, dynamic viewport inset, body-only overflow and intrinsic footer wrapping with stable DOM order.
- Propagation: approved only for `Popup` in Website Patterns / Modal; visual readiness remains `review` pending browser acceptance.
