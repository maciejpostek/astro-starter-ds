# Interaction and validation states

Status: active.

Astro owns state names, token aliases, accessibility and runtime precedence.
Figma mirrors the same contract with Color Variables, Effect Styles and a
single public `State` variant axis.

## Canonical states

- Interactive fields use `Default`, `Hover`, `Focus`, `Success`, `Warning`,
  `Error` and `Disabled`. Select may additionally use `Open`.
- Astro values are `none`, `success`, `warning` and `error`. The legacy values
  `default`, `valid` and `invalid` remain input aliases only.
- Only Error sets `aria-invalid="true"`. Success and Warning require visible
  semantic text or an icon and must never rely on color alone.

## Ring anatomy

- `Interaction/Focused`: a 2 px surface separator and a blue ring extending to
  4 px. It mirrors `--effect-focused`.
- `Validation/Error`, `Validation/Warning` and `Validation/Success`: the same
  2 px separator plus a subtle semantic ring extending to 4 px. They mirror
  `--effect-validation-error`, `--effect-validation-warning` and
  `--effect-validation-success`.
- Effects use spread only: no blur and no offset. Bind colors to semantic
  Variables in Light and Dark modes; do not hardcode status paints in masters.
- Apply the Effect Style to the actual interactive surface, never to a label,
  Hint or composition wrapper.
- A frame or component that owns a spread Effect Style must have
  `Clip content` enabled. Enable clipping on that exact interaction target,
  not on composition ancestors that would crop a nested indicator or control.
- Do not simulate a ring with an absolute or fixed-size `Interaction surface`,
  overlay rectangle or presentation-only wrapper. The Effect Style inherits
  the target's native radius and follows Hug, Fill and manual resize geometry.

## Precedence

`Disabled → Focus → Error → Warning → Success → Hover → Default`.

Disabled removes every halo. Keyboard focus replaces a status halo with the
blue focus ring while keeping the semantic border, Hint and icon. Hover never
overrides validation. Forced Colors uses system outlines and omits decorative
effects.

## Scope

Validation halos belong only to interactive controls such as Input, Select and
FileUpload. Alert, NotificationAndToast, FileUploadCard and Tag may use vivid
semantic content and strong outlined borders, but never a validation halo.
InlineSelect uses `Interaction/Focused` and does not expose validation.

## Figma quality gate

- Keep exactly one `Interaction/Focused` style and one style for each
  `Validation/*` status.
- Bind every Focus or Validation variant to the canonical style on its actual
  interaction target; raw copied effects fail the audit.
- Keep zero layers named `Interaction surface` in masters and documentation.
- Resize responsive controls at 240, 320 and 480 px and verify that the ring
  remains attached to the target without changing internal Fill/Hug behavior.
- Keep one public State axis. Document Focus plus status combinations in the
  Visual Calibration matrix instead of multiplying public master variants.
- Use SwitchButton as the visual benchmark for separator clarity and ring
  weight.
