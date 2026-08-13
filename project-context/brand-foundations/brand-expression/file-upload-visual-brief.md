---
status: approved
last-approved-at: 2026-08-11T13:00:00Z
---

# File Upload Visual Brief

## Scope

Applies only to `FileUpload`, `FileUploadCard` and `base-components/file-upload`.

## Invariants

- FileUpload keeps one native input, fixed upload icon, label, optional hint, canonical Browse Button and visible live status.
- FileUploadCard keeps one document icon, file identity, metadata, text status, contextual native actions and native progress while uploading.
- Existing local tokens own all surfaces, borders, typography, spacing, radius, focus, status and motion.

## Benchmark adaptation

- Adopt Align UI's clear anatomy and state completeness.
- Replace benchmark icons, raw colors, fixed widths and API with local Material Symbols, semantic variables, intrinsic layout and transport-agnostic events.
- Do not create a Figma FileUploadCard master under this approval.

## Review gate

Automated validation may pass while `readiness.visual` remains `review`. Human review must cover long names, localization, narrow containers, both color modes, forced colors and reduced motion before visual approval.
