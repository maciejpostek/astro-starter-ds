# Component Agentic Rule: Text

Status: active.

## 1. Identity

- Family: `text`.
- Atoms: `Eyebrow`, `DivideBlock`, `ContentDivider`.
- Molecules: `SectionHeader`, `PageHeader`.
- Sources live under `atoms/text` and `molecules/text`.
- Documentation: `/design-system/components#components-text-title`.
- Figma adapter: `Figma2Astro Agentic Rules/10-text-components.md`.

## 2. UX Role

Text components create repeated editorial hierarchy without replacing native
heading semantics.

## 3. Decision Priority

Use `PageHeader` for one page introduction, `SectionHeader` for repeated major
sections, `Eyebrow` for compact context, `DivideBlock` as a decorative inline
separator and `ContentDivider` as a semantic content separator.

## 4. Variant Decision Rules

`SectionHeader` uses `section` by default and `hero` only when it genuinely owns
the page-level h1. The prop maps to
`data-section-header-variant="section|hero"`. `ContentDivider` maps orientation
to `data-divider-orientation`; its optional label is valid only for the
horizontal orientation. Other components expose no decorative variants.

## 5. Context Of Use

Use these components for repeated page and section hierarchy. Keep intentionally
unique hero compositions local when their structure is not reusable.

## 6. Accessibility Pattern

Preserve one logical h1 per page. Decorative `DivideBlock` remains aria-hidden.
Eyebrow text supplements but never replaces the heading.

## 7. Content Pattern

Eyebrows are one to three words. Headings describe the following region.
Supporting descriptions are concise and useful without surrounding context.

## 8. Size And Density Rules

Typography comes from semantic text styles. Do not resize individual instances
with page selectors; use the supported component variant or update the system.

## 9. Composition Rules

`SectionHeader` and `PageHeader` compose `Eyebrow`. Section actions use the
named actions slot, typically with `ButtonGroup`. PageHeader's default slot
adds optional supporting content below the description.

## 10. Implementation Contract

- Files follow Atomic Design first and `text` family second.
- Reusable roots expose `data-component-name` and
  `data-component-family="text"`.
- `SectionHeader` exposes its finite visual prop through
  `data-section-header-variant`; do not restore a modifier-class API.
- Vertical `ContentDivider` ignores `label` and remains a pure semantic line.
- Figma represents `SectionHeader` actions and `PageHeader` support content as
  native slots, and both header compositions reuse the canonical Eyebrow
  master as a nested instance. Do not replace slots with Count variants or
  redraw Eyebrow locally.
- Figma represents the external bottom margins of `Eyebrow` and
  `SectionHeader` as padding inside their masters. Generate the canonical Astro
  margins, not additional padding.
- Responsive stacking below `64rem` is Astro-only and must not become a Figma
  variant axis.
- Component styling stays local and consumes semantic typography, spacing and
  color tokens.
- Sync docs, registry, sidebar, roadmap and this rule after contract changes.

## 11. Do / Do Not

Do reuse documented heading compositions. Do not build local eyebrow or section
header lookalikes, and do not use `DivideBlock` as meaningful punctuation.

## 12. Examples

```astro
<SectionHeader eyebrow="Services" title="Systems built for change">
  <ButtonGroup slot="actions">...</ButtonGroup>
</SectionHeader>
```

```astro
<PageHeader eyebrow="Contact" title="Start with context" description="Tell us what is changing." />
```

```astro
<Eyebrow text="Project context" />
```

```astro
<span>Design</span><DivideBlock /><span>Development</span>
```

```astro
<ContentDivider orientation="horizontal" label="Related" />
<ContentDivider orientation="vertical" />
```
