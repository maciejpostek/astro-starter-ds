# Astro Design System CSS Naming Conventions

This document defines how class names, data attributes, modifiers, and utility names are written in the Astro design system.

The goal is consistency for humans and AI agents. Names should reveal intent, avoid local invention, and support the framework rule:

```text
class = type / role
data-* = variant / sizing / state
CSS variables = values
```

## Core Rule

Use classes to define what an element is.

Use `data-*` attributes to define how that element varies.

Use CSS variables to define the value behind that variation.

Preferred:

```html
<div class="l-stack" data-gap="regular">
  ...
</div>
```

Avoid:

```html
<div class="u-flex u-gap-regular u-direction-column">
  ...
</div>
```

## Class Name Case

Use lowercase kebab-case for all class names.

```css
.section-header {}
.button-group {}
.project-card {}
```

Do not use camelCase, PascalCase, or snake_case for class names.

Avoid:

```css
.sectionHeader {}
.SectionHeader {}
.section_header {}
```

## Single Hyphen

Use a single hyphen to separate words in a class name.

```css
.section-header {}
.tag-list {}
.form-field {}
```

Single hyphen is for readable words, not for state or hierarchy.

## Double Underscore

Use double underscore only for an internal element of a component or layout primitive.

```css
.button__icon {}
.button__label {}
.section-header__eyebrow {}
.section-header__content {}
```

Meaning:

```text
component__element
```

Do not use double underscore for variants.

Avoid:

```css
.button__primary {}
.section__large {}
```

Those should be attributes:

```html
<button class="button" data-variant="primary">
<section class="l-section" data-padding="large">
```

## Double Hyphen

Double hyphen is allowed only for rare static modifiers that are not better expressed as `data-*`.

Allowed examples:

```css
.drawer--case {}
.drawer--stage {}
```

Use this only when the modifier describes a stable structural subtype.

Prefer attributes for variants, sizes, states, tones, and modes.

Preferred:

```html
<button class="button" data-variant="primary">
<span class="tag" data-tone="accent">
<div class="l-stack" data-gap="small">
```

Avoid:

```html
<button class="button button--primary">
<span class="tag tag--accent">
<div class="l-stack l-stack--small">
```

## Prefixes

Use prefixes only when they clarify category.

### Component Classes

Components do not need a prefix.

```css
.button {}
.input {}
.tag {}
.card {}
.section-header {}
```

The public root class must equal the registry ID. Public Base Components must
never use `.ds-*`; that prefix is reserved for documentation UI.

### Layout Classes

Use `l-` for reusable layout primitives.

```css
.l-section {}
.l-container {}
.l-stack {}
.l-cluster {}
.l-grid {}
```

Layout variants should use attributes.

```html
<section class="l-section" data-padding="large">
<div class="l-stack" data-gap="regular">
<div class="l-grid" data-columns="3">
```

### Utility Classes

Use `u-` only for small, generic escape hatches.

```css
.u-visually-hidden {}
.u-sr-only {}
```

Avoid creating a large utility class API for spacing, radius, typography, or colors unless the design system explicitly approves it.

Typography uses a small approved class API rather than a utility scale:

```css
.heading-h1 {}
.body-base-regular {}
.body-base-regular-underlined {}
.body-base-semibold {}
```

These Text Style classes are complete semantic typography contracts. HTML tags
still own document hierarchy, so `<h3 class="heading-h1">` is valid. Do not
create standalone size aliases such as `.body-base`, partial font-size
utilities or `--text-style-*` token aliases. This naming decision does not
change semantic color-token conventions.

### Design System Documentation Classes

Use `ds-` for documentation-only UI.

```css
.ds-doc-card {}
.ds-spacing-block {}
.ds-attribute-block {}
.ds-copy-button {}
```

These classes are for the `/design-system` documentation interface, not production page components.

## CSS Variable Names And Ownership

Token names are registered system API, not a local component implementation
technique. Before using or adding one, resolve its semantic owner in
`src/data/design-system/tokenArchitecture.json`.

- Component tokens use the owner directly: `--switch-track-off-background-hover`.
- Do not use `ds`, `_ds`, `component`, or a project name in public token names.
- Do not declare custom properties inside public component files.
- Do not create a private alias only to shorten an existing token name.
- `--control-*` is the sole approved shared attribute bridge and is defined in
  `src/styles/tokens/control-sizes.css`.
- Runtime position and measurement values use native `element.style`
  properties. They are not documented as design tokens.

When no registered group satisfies a need, stop after producing a
`tokenDraft`. New names and CSS sources may be implemented only after that
exact draft is approved.

### State Classes

Prefer `data-state` for component state.

```html
<button class="accordion" data-state="open">
```

Use `is-*` or `has-*` only for JS-driven state when an attribute is not practical or when existing code already uses that pattern.

```css
.is-current {}
.is-active {}
.has-error {}
```

## Data Attributes

Use lowercase kebab-case for data attribute names.

```html
data-control-size
data-variant
data-state
data-gap
data-padding
data-radius
```

Use short lowercase values.

```html
data-control-size="small"
data-gap="regular"
data-padding="large"
data-state="open"
```

For multi-word values, use kebab-case unless the value must match an existing token name.

```html
data-variant="media-left"
data-density="compact"
```

## Attribute Responsibility

Attributes should represent controlled variants, not arbitrary styling.

Good:

```html
<div class="l-stack" data-gap="medium">
<article class="card" data-radius="medium">
<button class="button" data-control-size="small">
```

Bad:

```html
<div data-gap="medium">
<article data-radius="medium">
<button data-control-size="small">
```

The class defines the object. The attribute modifies that object.

## CSS Variable Naming

Class names should not encode raw values.

Avoid:

```css
.gap-12 {}
.radius-8 {}
.padding-24 {}
```

Use semantic variables and attributes instead.

```css
.l-stack[data-gap="regular"] {
  gap: var(--gap-regular);
}

.surface[data-radius="medium"] {
  border-radius: var(--radius-medium);
}
```

## When To Create A New Class

Create a new class when:

- the element has a stable role,
- the pattern appears more than once,
- the class can be documented and reused,
- the class describes structure, component identity, or layout primitive.

Do not create a new class when:

- the need is a one-off variant,
- an existing component prop can express it,
- a `data-*` attribute can express it,
- a semantic token already solves it,
- it only exists to apply one local visual value.

## When To Create A New Attribute

Create or extend a `data-*` attribute when:

- a component or layout has a finite set of variants,
- the variant maps cleanly to semantic tokens,
- the value should be readable in HTML,
- AI agents should understand the intent directly.

Examples:

```html
data-gap="small"
data-padding="large"
data-radius="medium"
data-state="open"
data-tone="accent"
```

## Recommended Pattern

For components:

```html
<button class="button" data-control-size="small" data-variant="primary">
  <span class="button__label">Action</span>
  <span class="button__icon">...</span>
</button>
```

For layouts:

```html
<section class="l-section" data-padding="large">
  <div class="l-container">
    <div class="l-stack" data-gap="regular">
      ...
    </div>
  </div>
</section>
```

For documentation components:

```html
<div class="ds-attribute-block">
  ...
</div>
```

## Decision Summary

- Use kebab-case for classes and attributes.
- Use single hyphen to separate words.
- Use double underscore for component elements.
- Use double hyphen only for rare structural modifiers.
- Prefer `data-*` attributes for variants, sizing, states, tone, density, and mode.
- Use `l-` for layout primitives.
- Use `u-` only for rare utilities.
- Use `ds-` for design system documentation UI.
- Keep class names about role, not values.
- Keep values in CSS variables.
