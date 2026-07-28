# Component Agentic Rule: Forms

Status: active.

## 1. Identity

- Family: `forms`.
- Atoms: `Input`, `Label`, `Checkbox`, `Radio`, `FileUpload`, `Select`.
- Molecules: `FormField`, `SearchInput`, `Fieldset`, `ConsentField`.
- Organisms: `Form`, `CalComEmbed`.
- Sources live under `atoms/forms`, `molecules/forms` and `organisms/forms`.
- Documentation: `/design-system/components#components-forms-title`.

## 2. UX Role

Forms collect structured user input. Native controls own interaction and browser
semantics; components provide consistent labels, states, spacing and visual
contracts. Submission, persistence and server validation stay in the consuming
project.

## 3. Decision Priority

1. Use the native control that matches the data.
2. Add a visible `Label` and explicit association.
3. Wrap text-entry controls in `FormField`.
4. Use `Form` for repeated field layout.
5. Use `CalComEmbed` only for a configured scheduling flow.
6. Use `FileUpload`, native `Select` and `SearchInput` instead of page-local lookalikes.
7. Use `Fieldset` for a related Checkbox or Radio group with one shared legend.
8. Use `ConsentField` only for an independent checkbox-based consent or acknowledgement.

### Label Decision Rules

- Use `variant="field"` for a form-control name. It renders a native `label`;
  when the control is not nested, match `for` to the control `id`.
- Use `variant="metric"` for compact non-form metadata. It renders a neutral
  `span`, never a form label.
- Do not use Label as a heading, eyebrow, hint, validation message or generic
  text-style escape hatch.

## 4. Variant Decision Rules

- Use `Input` for one-line text and `multiline` for longer free text.
- Use `Checkbox` for independent choices or multiple selections.
- Use `Radio` for exactly one choice from a named group.
- Use `state="invalid"` or `state="valid"` only after real validation.
- Use component sizes only where density differs intentionally.
- FileUpload keeps a real native file input; SearchInput keeps a real search input.
- Fieldset states are `default`, `invalid` and native `disabled`.
- ConsentField states are `default`, `invalid` and native `disabled`; it has no
  radio variant because consent is an independent boolean choice.
- Input, textarea, Select, SearchInput, FileUpload and Checkbox use the sharp
  zero-radius component tokens. Radio remains circular to preserve its control identity.
- Form states are `default`, `validating`, `submitting`, `success` and `error`;
  busy states expose `aria-busy` and outcome messages use a live status role.

## 5. Context Of Use

Use Forms components in contact, onboarding, filtering and project-intake
flows. Do not use styled text or generic containers as substitutes for native
controls. Do not place project-specific endpoints or account identifiers inside
the components.

## 6. Accessibility Pattern

- Every control has a visible label.
- `FormField.for` matches the child control `id`.
- Checkbox and Radio require stable page-unique IDs.
- Their documented state matrix covers default, hover, active, focus, checked
  and disabled; Checkbox additionally supports the native indeterminate state.
- `checked` and `indeterminate` are native control properties, not visual-only
  ARIA replacements.
- The public `indeterminate` prop initializes the native DOM property and
  exposes `aria-checked="mixed"`; styling alone is not an implementation.
- Checkbox uses Lucide `Check` and `Minus` only as decorative reflections of
  those native properties. Radio and Switch indicators remain control geometry.
- Radio groups share a `name` and their composition supplies a `fieldset` and
  `legend` when the group needs a question label.
- Fieldset requires a stable `id` and visible `legend`; its slotted controls
  retain stable page-unique IDs and native names.
- ConsentField composes Checkbox, never preselects consent by default, keeps
  `required` native, and reveals its alert only after an invalid state exists.
- Preserve native `name`, `required`, `disabled`, autocomplete and validity
  attributes.
- Invalid controls expose `aria-invalid`; validation messages remain visible.
- Submit actions use `Button type="submit"`.
- Use Lucide `Upload` for FileUpload and a context-specific `Button` icon such
  as `Send` for submission; do not use Unicode arrows or pasted SVG paths.

## 7. Content Pattern

Labels are concise nouns or questions. Hints explain format before failure.
Validation messages explain the problem and the correction. Placeholder text
never replaces a visible label.

## 8. Size And Density Rules

Use `small`, `medium` and `large` through `data-component-size`. Default to
`medium` in forms. Do not resize a field locally with page CSS; extend the
shared size contract if a repeated density is missing.

## 9. Composition Rules

- `FormField` composes `Label` with one control plus optional hint/message.
- `Fieldset` composes a native legend with a freely ordered default slot of
  related Checkbox or Radio controls.
- `ConsentField` composes Checkbox with optional policy details and an invalid
  message. Project policy links and legal wording remain consumer-owned.
- `Form` arranges fields and actions but does not own submission logic.
- The Figma adapter represents repeatable Form content with one native
  `Fields` Slot, not Count variants. Astro slot content remains unrestricted.
- Checkbox and Radio may be grouped by a parent using semantic fieldset markup.
- `CalComEmbed` is standalone and must not inherit project-specific links.
- CalComEmbed does not expose a loading/loaded component state. Iframe loading
  and the remote Cal.com interface remain browser/runtime behavior.

## 10. Implementation Contract

- Files follow Atomic Design first and the `forms` family second.
- Component roots keep `data-component-name`.
- Component roots keep `data-component-family="forms"`.
- Size and state are rendered through explicit `data-*` attributes.
- Documentation state controls must update the native input properties as well
  as the preview attribute.
- Components consume size, color, typography and focus tokens.
- Focus geometry uses `--size-2` for `outline-offset`; the semantic
  `--color-state-focus-ring-offset` remains a color and must never be used as
  a CSS length.
- Component-owned styling stays in the component.
- Update docs, sidebar, registry, roadmap and this rule together after API
  changes.

## 11. Do / Do Not

Do use native HTML controls, stable IDs, real validation state and meaningful
autocomplete values. Do not create checkbox/radio lookalikes with `div`, hardcode
client URLs in `CalComEmbed`, or add form-specific overrides in `global.css`.

## 12. Examples

```astro
<Form aria-label="Project enquiry">
  <FormField for="work-email" label="Work e-mail">
    <Input id="work-email" name="email" type="email" autocomplete="email" />
  </FormField>
  <Checkbox id="terms" name="terms" label="I accept the terms" required />
  <Button type="submit">Send</Button>
</Form>
```

```astro
<CalComEmbed calLink="team/discovery" title="Book a discovery call" />
```

```astro
<Fieldset id="project-type" legend="Project type">
  <Radio id="new-project" name="projectType" value="new" label="New project" />
  <Radio id="existing-project" name="projectType" value="existing" label="Existing project" />
</Fieldset>
```

```astro
<ConsentField
  id="privacy-consent"
  name="privacyConsent"
  label="I agree to the privacy policy"
  required
>
  <a slot="details" href="/privacy">Read the privacy policy</a>
</ConsentField>
```
