# Agentic Typography Rules

Status: active.

## Deterministic authoring gate

For every component or styling decision use `resolve → reuse → prove gap → draft → approve → implement`. Resolve registered component, dependency, use-case and global token groups in that order. Stop on `ambiguous`; a `gap` may change CSS only after an exact `tokenDraft` is approved. Do not invent namespaces, local custom properties, groups or source files. The canonical sources are `architecture/component-authoring-contract.json` and `src/data/design-system/tokenArchitecture.json`.

Read this file when a task changes or consumes typography tokens, Text Style
classes, heading or paragraph markup, compact component typography, typography
utilities or typography documentation.

Source references:

- `AGENTIC-RULES.json`
- `.agentic-rules/00-framework.md`
- `src/styles/tokens/typography-foundations.css`
- `src/styles/tokens/typography-styles.css`
- `src/data/design-system/typographyTokens.ts`
- `src/documentation/design-system/foundations/typography.astro`

## Architecture

Typography uses one short public path:

```txt
typography foundation tokens
  -> complete Text Style classes
  -> neutral HTML
```

There is no semantic typography-token alias layer. A Text Style class is the
semantic visual contract. HTML elements describe document structure only.

This exception is scoped to typography. It does not authorize removing or
bypassing semantic color, sizing, layout or component tokens. In particular,
UI colors must continue to consume semantic or component color contracts.

## HTML Semantics

- Use `h1` through `h6` for document hierarchy and accessibility.
- Use `.heading-h1` through `.heading-h6` for visual scale.
- A semantic heading level may use a different visual class, for example
  `<h3 class="heading-h1">Release overview</h3>`.
- Give every documentation heading an explicit `.heading-*` class.
- Give content paragraphs an explicit Body Text Style class.
- Keep the canonical `h1-h6` and `p` reset in `typography-styles.css` neutral.
- Do not add competing global heading or paragraph typography.

## Public Text Styles

Exactly 31 public classes exist:

- `.heading-h1` through `.heading-h6`,
- `.body-{large|medium|base|small|tiny}-regular`,
- `.body-{large|medium|base|small|tiny}-regular-underlined`,
- `.body-{large|medium|base|small|tiny}-semibold`,
- `.caption-{small|tiny}`.
- `.rich-text-heading-h1` through `.rich-text-heading-h6`.
- `.rich-text-body-{base|large}-regular`.

Standalone `.body-large`, `.body-medium`, `.body-base`, `.body-small` and
`.body-tiny` classes are not part of the API.

Rich Text is an independent editorial family. Its H1-H6, Body Base and Body
Large classes consume dedicated family, weight, size, line-height and tracking
tokens. `RichTextHeading` exposes only semantic H2-H6; Rich Text H1 is reserved
for a separate entry hero. Use Body Base for ordinary prose and Body Large for
intentional leads or quotations.

Caption is a global Text Style role alongside Heading and Body. Caption Small
uses 14px and Caption Tiny uses 12px; both use normal weight, compact line
height, tight tracking and uppercase casing. The Caption classes reuse the
approved Body size tokens and do not create a parallel font-size scale.

Each class owns the complete contract:

- font family,
- font size,
- font weight and style,
- line height and letter spacing,
- text transform,
- text wrap, overflow wrap, word break and white-space.

Regular Underlined additionally owns its underline properties. Do not combine
multiple Heading or Body classes on one element and do not recreate a partial
Text Style with local declarations.

## Tokens

`typography-foundations.css` is the only typography token source. Text Style
classes consume its existing tokens directly.

- Do not create typography aliases that merely rename one foundation token.
- Do not create new tokens without an approved gap.
- Do not use foundation font-size tokens directly in page content markup.
- Compact component typography may use foundation tokens locally.

## Compact Component Typography

Buttons, tags, inputs, navigation, tables, labels, statuses and code are not
forced into global Text Styles. Their compact typography may remain local and
token-based when it belongs to the component contract.

- Keep component text properties inside the owning component.
- Use the existing family, size, weight, line-height and tracking tokens.
- Do not create per-component typography variables by default.
- `--font-family-mono` is internal and reserved for code or technical UI.
- Component color still uses semantic or component color variables.

## Utilities

Approved utilities are limited to:

- font style: `.u-font-normal`, `.u-font-italic`,
- text transform: `.u-text-transform-*`,
- text wrap: `.u-text-wrap*`,
- overflow wrap: `.u-overflow-wrap-*`,
- word break: `.u-word-break-*`,
- white-space: `.u-white-space-*`.

Utilities are narrow overrides. Do not add font-size, line-height, color,
spacing or heading-level utilities.

## Design-tool Projection

Astro is canonical for this implementation. Figma typography synchronization
is a separate operation and must be explicitly requested. Relative-unit
adapters remain:

```txt
Figma line height percentage / 100 -> Astro unitless line height
Figma letter spacing percentage / 100 -> Astro em letter spacing
```

Do not infer that an Astro typography change authorizes a Figma mutation.

## Documentation and Validation

When typography changes:

- update `typography-styles.css`,
- update `typographyTokens.ts`,
- update the Typography foundation page,
- migrate affected content nodes to the public classes,
- keep token search and documentation registries free of removed aliases,
- run the runtime tests, foundation/documentation/agentic audits, build and
  `npm run validate`.

The foundation audit must reject removed typography aliases, legacy Body
classes, documentation headings without `.heading-*`, and direct content
heading typography outside the canonical class contracts.
