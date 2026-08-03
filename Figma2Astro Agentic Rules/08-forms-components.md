# Figma2Astro: Forms Components

Status: active.

This rule maps the `40.2 Forms` Figma page to the twelve public Astro
components in the `forms` family. Code remains the source of truth for HTML
semantics, props, `data-*` attributes, native state, and browser behavior.

## 1. Family scope

```text
atoms
├── Input
├── Label
├── Checkbox
├── Radio
├── FileUpload
└── Select

molecules
├── SearchInput
├── FormField
├── Fieldset
└── ConsentField

organisms
├── Form
└── CalComEmbed
```

The Figma page contains eleven Component Sets and one standalone Component:

| Master | Figma node | Astro | Figma representation | Count |
| --- | --- | --- | --- | ---: |
| `Input` | `215:29` | `src/components/atoms/forms/Input.astro` | `Type=Input|Textarea × State=Default|Hover|Focus|Invalid|Valid|Disabled` | 12 |
| `Label` | `216:9` | `src/components/atoms/forms/Label.astro` | `Variant=Metric|Field` | 2 |
| `Checkbox` | `219:110` | `src/components/atoms/forms/Checkbox.astro` | `Selection=Unchecked|Checked|Indeterminate × State=Default|Hover|Pressed|Focus|Disabled` | 15 |
| `Radio` | `220:80` | `src/components/atoms/forms/Radio.astro` | `Selection=Unchecked|Checked × State=Default|Hover|Pressed|Focus|Disabled` | 10 |
| `Fieldset` | `511:204` | `src/components/molecules/forms/Fieldset.astro` | `State=Default|Invalid|Disabled` plus an `Options` Slot | 3 |
| `ConsentField` | `513:211` | `src/components/molecules/forms/ConsentField.astro` | `State=Default|Invalid|Disabled` with a nested Checkbox | 3 |
| `FileUpload` | `221:88` | `src/components/atoms/forms/FileUpload.astro` | `State=Default|Hover|Focus|Dragging|Selected|Invalid|Disabled` | 7 |
| `Select` | `222:83` | `src/components/atoms/forms/Select.astro` | `State=Default|Hover|Focus|Valid|Invalid|Disabled` | 6 |
| `SearchInput` | `223:137` | `src/components/molecules/forms/SearchInput.astro` | `Content=Empty|Filled × State=Default|Hover|Focus|Disabled` | 8 |
| `FormField` | `224:122` | `src/components/molecules/forms/FormField.astro` | `State=Default|Invalid|Valid` | 3 |
| `Form` | `225:455` | `src/components/organisms/forms/Form.astro` | `State=Default|Validating|Submitting|Success|Error` plus a `Fields` Slot | 5 |
| `CalComEmbed` | `226:380` | `src/components/organisms/forms/CalComEmbed.astro` | standalone Component | 1 |

## 2. Property mapping

### Input

```text
Figma Type=Input
  -> <Input multiline={false}>

Figma Type=Textarea
  -> <Input multiline>

Figma State=Invalid|Valid
  -> state="invalid"|"valid"

Figma State=Hover|Focus|Disabled
  -> native pseudo-class or disabled attribute
```

`Placeholder` is a TEXT property. Size comes from the `Component Size`
collection and defaults to `Medium`.

### Label

`Variant=Metric|Field` maps directly to `variant`. The `Label` TEXT property
maps to the default slot. `Field` renders a native `label`; its `for` prop has
no visual representation, so agents must associate it with the matching
control `id` in Astro. `Metric` renders a neutral `span` for non-form metadata.
This semantic distinction remains code-owned and does not add a Figma axis.

### Checkbox and Radio

`Selection` maps to native input properties:

```text
Unchecked     -> checked={false}
Checked       -> checked
Indeterminate -> indeterminate / element.indeterminate = true
```

Only Checkbox supports `Indeterminate`. `State` represents pseudo-classes,
`disabled`, or a deterministic documentation preview. Figma does not replace
native `checked`, `indeterminate`, `name`, `required`, or radio-group
semantics. Astro exposes `indeterminate`, sets the DOM property, and exposes
`aria-checked="mixed"`.

`Label` and `Description` are TEXT properties. `Show Description` is BOOLEAN.
Checkbox uses existing Lucide `Check` and `Minus` icon instances. Radio keeps
native circular control geometry.

### Fieldset

`State=Default|Invalid|Disabled` maps to `data-fieldset-state`, group
validation, or the native `disabled` attribute. `Legend`, `Description`, and
`Message` are editable TEXT properties. `Show Description` and `Show Message`
are BOOLEAN properties.

`Options` is one shared SLOT property across all three variants. It defaults
to two Radio instances, prefers existing Checkbox and Radio Component Sets,
stretches inserted controls, uses `minChildren=2` as Figma guidance, and has
no maximum. Astro preserves unrestricted default slot content and native
fieldset/legend semantics.

### ConsentField

`State=Default|Invalid|Disabled` maps to `data-consent-state`, an accessible
error, or the nested Checkbox disabled state. ConsentField always composes
Checkbox and has no Radio variant. `Details`, `Show Details`, and `Error` are
parent properties. Checkbox label and description remain editable on the
nested instance.

Policy links and legal wording remain code-owned project data. Consent must
not be preselected by the starter.

### FileUpload

`State` maps to `data-upload-state`, native focus and hover, or
`data-preview-state`. `Label`, `Hint`, and `Output` are TEXT properties.
`Show Hint` is BOOLEAN.

`accept`, `multiple`, the file picker, drag and drop, and selected file names
remain Astro and browser behavior. Figma represents only their controlled
visual states.

### Select

Figma represents the closed control. `Value` is a TEXT property. The options
array, open menu, and keyboard navigation remain the native `<select>`
implementation and are not constrained by the number of Figma children.

### SearchInput

`Content=Empty|Filled` maps to `data-search-state`. `State` maps to native
pseudo-classes or `disabled`. `Value` and the visually hidden
`Accessible Label` are TEXT properties. Search and X are instances from
`30.1 Icons`. Clear remains a real Astro `<button>`.

### FormField

`State` maps to `data-field-state`. The master composes a Label instance and a
swappable `Control` instance. `Hint`, `Message`, `Show Hint`, and
`Show Message` are Figma properties.

Figma INSTANCE_SWAP `Control` does not constrain the Astro slot. Agents may
use Input, Select, or another compatible native control while preserving the
`for` and `id` relationship.

### Form

`State` maps directly to `data-form-state`. `Status Message` and
`Show Status` map to the optional `statusMessage`. `Action` is an
INSTANCE_SWAP that defaults to Button.

`Fields` is one shared SLOT property across all five State variants. The slot:

- contains a default FormField instance;
- allows adding, removing, duplicating, and reordering fields;
- stretches inserted elements to the available width;
- has `minChildren=1` and no maximum;
- prefers FormField, Checkbox, Radio, FileUpload, Select, and SearchInput.

Preferred instances guide designers without limiting Astro. `<slot />`
continues to accept any number and order of compatible elements. Nested
component properties are edited on their instances rather than duplicated on
Form.

When the current `use_figma` runtime does not expose `minChildren`,
`maxChildren`, or `slotContentId`, record that limitation explicitly. Validate
the shared `Fields` SLOT definition, ordered SlotNode children, preferred
component family, bindings, and `limitViolations`; never infer unavailable
values.

### CalComEmbed

This is a standalone Component because Astro exposes no visual variant or
state. `Title` and the hidden `Cal Link` are TEXT properties. Frame height is
Figma geometry; `height`, the iframe, loading, and the remote Cal.com UI remain
runtime behavior.

Do not generate `State=Loading|Loaded`; no such prop or public `data-*`
attribute exists.

## 3. Bindings

- fields use `Component/input/*`;
- Label uses `Component/label/*`;
- control sizes use `Component Size` modes;
- every active border edge uses
  `Sizing Semantic / border-width/default`;
- focus uses `Global/state/focus/ring*` colors and the mechanical
  `Sizing Primitives / 2` and `/ 4` spread values;
- spacing, padding, and radius use existing semantic tokens;
- text uses existing Text Styles and Typography Variables;
- icons are instances from `30.1 Icons`.

Checkbox, Radio, and Tab use `--size-2` for `outline-offset`.
`--color-state-focus-ring-offset` remains a color and must never be used as a
CSS length.

## 4. Native properties

The following remain native and must not become new Variables:

- pressed transforms for Checkbox and Radio;
- busy and disabled opacity;
- dashed or solid FileUpload border style;
- Auto Layout and indicator geometry;
- the native Select menu;
- file-picker and drag-and-drop behavior;
- iframe and external Cal.com UI;
- cursor, focus management, and browser validation.

## 5. Astro generation algorithm

1. Read the master name and variant properties.
2. Find the matching public component under `src/components/*/forms`.
3. Convert visual state to a prop, native attribute, or pseudo-class using
   this mapping.
4. Convert the `Component Size` mode to `componentSize` and
   `data-component-size`.
5. If design context omits Slot content, use `use_figma` to inspect `Fields#*`,
   the shared `slotContentId`, and SlotNode children.
6. For Form, read the SLOT children in their actual order and render them
   inside `<Form>`.
7. Restore real data such as options, fields, file names, calLink, and slots.
8. Preserve native elements and the required `for`, `id`, and `name`
   relationships.
9. Never copy numeric values or colors from Figma into local CSS.

## 6. Validation

- exactly twelve public masters exist on the page;
- eleven masters are Component Sets and CalComEmbed is a standalone Component;
- variant counts match the table;
- every field has separate color and four active border-edge bindings;
- Component Size defaults to `Medium`;
- Checkbox, Radio, and SearchInput reuse the correct icons;
- FormField reuses Label and Input;
- Fieldset has three State variants and one shared `Options` SLOT that prefers
  Checkbox and Radio;
- ConsentField has three State variants, reuses Checkbox, and has no Radio
  variant;
- Form reuses FormField and Button;
- Form has five State variants and no Count axis;
- every Form variant refers to one shared `Fields` SLOT property;
- every Slot has a default FormField, correct preferred instances, a bound gap,
  and no `limitViolations`;
- CalComEmbed has no loading or loaded variant;
- no Figma-only collection or token is introduced.
