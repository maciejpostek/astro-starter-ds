---
status: review
last-reviewed-at: null
---

# Project Visual QA

Copy the relevant criteria from
`art-direction/templates/visual-quality-scorecard.md`, add project-specific
non-negotiables, and record human review decisions before propagating a pilot
to a complete family.

## Project-Specific Criteria

- Social platform geometry remains recognizable at every Control Size without changing the control geometry.
- Icon and label balance remains consistent with Button and IconButton across Primary, Secondary, and Tertiary emphasis.
- Provider identity never overrides the local surface, border, text, focus, or state hierarchy.
- Monochrome social marks inherit the active icon-state token in default, hover, pressed, and disabled states.
- FileUpload preserves native picker, drag and drop, selected names, rejection announcements and visible focus at 320, 400, 768 and 1440 px.
- FileUploadCard preserves file-name wrapping, metadata, status text, progress and action order at every assigned width.
- Upload states remain distinguishable without color in forced-colors mode and indeterminate progress does not animate under reduced motion.
- Popup remains centered and fully inset at 320, 400, 768 and 1440 px while long copy scrolls without moving actions outside reach.
- Popup status remains understandable without color, action order remains preference–Cancel–Confirm in LTR and RTL, and the native backdrop covers the complete viewport at black/20% in both themes.
- Popup focus opens on Cancel or Confirm, remains trapped by the native dialog and returns to the previous trigger after every close path.

## Calibration Reviews

- Pending browser review of the canonical SocialButton and SocialIconButton documentation pilots.
- Pending browser review of FileUpload and FileUploadCard in light, dark, forced-colors and reduced-motion modes.
- Pending browser review of Popup across four statuses, two alignments, optional footer parts, dismissal modes, long content, RTL, forced colors and reduced motion.

## Approved Propagation Scope

- Contract direction is approved only for the Social Buttons, File Upload and Popup pilots; visual readiness remains `review` until the rendered pilots receive human approval.
