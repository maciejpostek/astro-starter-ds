# Component Agentic Rule: Design System Documentation

Status: active.

## 1. Identity

- Family: `documentation`.
- Core components: `DsTableOfContents`, `DsSectionHeader`, `DsCodeSnippet`,
  `DsTableFrame`, `DsColorRow`, `DsAutomatedTokenDocumentation`, `DsCallout`.
- Sources remain in `src/components/design-system*` by architecture exception.

## 2. UX Role

Documentation components render reusable navigation, headings, examples and
token tables for humans and agents.

## 3. Decision Priority

Reuse an existing Ds component before writing page-local documentation markup.
Use the most specific block available for the token/content type.

## 4. Variant Decision Rules

Expose only table sizes, metadata states and columns supported by the real
component. Do not invent documentation variants in pages.

## 5. Context Of Use

Use only inside design-system documentation and internal tooling. Public product
pages use normal system components.

## 6. Accessibility Pattern

Tables expose correct table roles and labels. TOC uses native navigation and
anchors. Code copy controls are buttons and use Lucide `Copy`. Headers preserve heading hierarchy.

## 7. Content Pattern

Show real token names, values, roles, APIs and examples. Do not document future
or unsupported behavior as current.

## 8. Size And Density Rules

Documentation tables use the shared tiny density and horizontal overflow when
needed. Pages do not redefine cell geometry.

## 9. Composition Rules

Build complex blocks from DsTableFrame/Row/Cell and shared copy controls. Keep
sidebar anchors aligned with real section IDs.

## 10. Implementation Contract

The `Ds*` prefix identifies documentation infrastructure. Routes remain under
`/design-system`. Update source, docs, navigation and registry together. Keep
the runtime DsSidebar singleton separate from in-page TOC previews.
`DsCallout` lives in `src/components/design-system-documentation` and composes
the public `CalloutCard`; it is not a public Sections-family component.

## 11. Do / Do Not

Do render source-backed documentation and use named Lucide icons. Do not create
one-off tables, fake anchors, duplicate sidebar controllers or pasted SVG icons.

## 12. Examples

```astro
<DsTableOfContents items={items} />
<DsCodeSnippet code={example} />
<DsAutomatedTokenDocumentation source="size-semantic.css" prefix="--gap" />
<DsCallout />
```
