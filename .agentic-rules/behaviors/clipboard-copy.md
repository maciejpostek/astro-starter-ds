# Behavior Agentic Rule: Clipboard Copy

Status: active.

Use this file when an agent needs to add copy-to-clipboard behavior to any
interactive component in the Astro design system.

## 1. Identity

- Behavior name: `ClipboardCopy`
- Source: `src/components/global-scripts/ClipboardCopy.astro`
- Layer: `global-script`
- Related component family: `actions`
- Owner: behavior layer, not Button.

Rules:

- This is not a standalone UI component.
- Do not create `CopyButton`, `CopyToClipboardButton` or a copy-specific Button
  variant.
- Attach the behavior to the component that already has the correct UX role,
  such as `Button`, `IconButton`, a native button, or another existing
  interactive component.

## 2. UX Role

Clipboard Copy lets a user capture a known value without leaving the current
context.

Use it for:

- copying an email address;
- copying the current page or case-study URL;
- copying a short identifier, token, code value or shareable string;
- utility actions where the visual component is chosen by context.

Do not use it for:

- navigation;
- form submission;
- destructive actions;
- hidden data that the user cannot reasonably understand from the surrounding
  UI;
- replacing a normal link when navigation is the expected user intent.

## 3. Attribute Contract

Enable behavior:

```html
data-clipboard-copy
```

Copy an explicit value:

```html
data-clipboard-value="hello@example.com"
```

Copy the current URL:

```html
data-clipboard-source="current-url"
```

Copy value or text from another element:

```html
data-clipboard-target="#email-source"
```

Optional feedback label:

```html
data-clipboard-copied-label="Copied"
data-clipboard-restore-delay="1600"
```

Child label updated after copy:

```html
<span data-clipboard-label>Copy email</span>
```

Rules:

- Prefer `data-clipboard-value` for static known values such as email.
- Use `data-clipboard-source="current-url"` for shareable current-page links.
- Use `data-clipboard-target` only when the value is already rendered elsewhere.
- Do not hard-code clipboard listeners in page-level scripts.

## 4. Accessibility Pattern

Rules:

- Use a native `<button type="button">` branch for JavaScript-only copy actions.
- If the control is icon-only, use `IconButton` and provide `aria-label`.
- The visible label should describe the copied value or result, such as
  `Copy email` or `Copy link`.
- Short success feedback may update `[data-clipboard-label]`.
- Do not use `href="#"` for clipboard behavior.

## 5. Button Integration

Use Button when visible text is useful:

```astro
<Button
  variant="secondary"
  type="button"
  data-clipboard-copy
  data-clipboard-value="hello@example.com"
  data-clipboard-copied-label="E-mail copied"
>
  <span data-clipboard-label>Copy email</span>
</Button>
```

Use IconButton when the context already explains the action:

```astro
<IconButton
  variant="secondary"
  type="button"
  aria-label="Copy link"
  data-clipboard-copy
  data-clipboard-source="current-url"
>
  <Link2 />
</IconButton>
```

## 6. Do / Do Not

Do:

- choose the visual component from the action hierarchy first;
- attach clipboard behavior through `data-clipboard-*` attributes;
- keep one global behavior implementation in `ClipboardCopy.astro`;
- update this rule when the public attribute contract changes.

Do not:

- create a dedicated copy button component;
- duplicate clipboard JavaScript inside pages, drawers or cards;
- use copy behavior for navigation;
- hide what will be copied when the action could surprise the user.
