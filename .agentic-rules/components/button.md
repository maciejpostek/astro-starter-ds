# Component Agentic Rule: Button

Status: active.

Use this file when an agent needs to place, modify, document or choose a Button,
IconButton variant, ButtonGroup wrapper or SwitchButton in the Astro design system.

## 1. Identity

- Astro components: `Button`, `IconButton`, `ButtonGroup`, `SwitchButton`
- Sources:
  - `src/components/atoms/actions/Button.astro`
  - `src/components/atoms/actions/IconButton.astro`
  - `src/components/molecules/actions/ButtonGroup.astro`
  - `src/components/atoms/actions/SwitchButton.astro`
- Atomic layers: `atom`, `molecule`
- Family: `actions`
- Related docs: `/design-system/components#components-actions-button-title`
- Component names:
  - `Button.Primary`
  - `Button.Secondary`
  - `Button.Link`
  - `IconButton.Primary`
  - `IconButton.Secondary`
  - `ButtonGroup`
  - `SwitchButton`
- Public props:
  - `variant?: "primary" | "secondary" | "link"`
  - `size?: "small" | "medium" | "large"`
  - `href?: string`
  - `type?: "button" | "submit" | "reset"`
  - `full?: boolean`
  - `showIcon?: boolean`
  - named `icon` slot for a context-specific Lucide icon
  - `componentName?: string`
  - `class?: string`
- Public attributes:
  - `data-component-name`
  - `data-component-size`
- Icon-only public props:
  - `label: string`
  - `variant?: "primary" | "secondary"`
  - `size?: "small" | "medium" | "large"`
  - `href?: string`
  - `type?: "button" | "submit" | "reset"`
  - `title?: string`
  - `componentName?: string`
  - `class?: string`
- ButtonGroup public props:
  - `class?: string`
- SwitchButton public props:
  - `label: string`
  - `checked?: boolean`
  - `componentSize?: "small" | "medium" | "large"`
  - `disabled?: boolean`
  - `componentName?: string`
- SwitchButton public attributes and events:
  - `role="switch"`
  - `aria-checked`
  - `data-component-name`
  - `data-component-family="actions"`
  - `data-component-size`
  - `data-switch-state`
  - bubbling `switch-change` custom event with `{ checked }`

Rules:

- Use `Button` for text-labeled actions.
- Use `IconButton` for icon-only actions, documented as `IconButton.Primary`
  or `IconButton.Secondary`.
- Use `ButtonGroup` as a supportive composition wrapper for related action
  controls.
- Use `SwitchButton` for an immediately applied binary setting. Use Checkbox
  when the choice belongs to a form submission.
- Use the named `icon` slot when the action has a specific meaning such as
  send, confirm, reset or preview. The default arrow is only a neutral fallback.
- Do not create local `.button`, `.cta`, `.text-link` or card-specific button
  lookalikes.
- `Button.Tertiary` is not a current variant. Use `Button.Link` for low-emphasis
  text actions.

## 2. UX Role

Button helps the user make an intentional decision: navigate, submit, open,
confirm, reset or reveal something.

The component is an action affordance, not decoration. Its variant should express
the importance of the action inside the current local decision context.

## 3. Decision Priority

1. If this is the main action in the local context, use `Button.Primary`.
2. If this supports or competes with a primary action, use `Button.Secondary`.
3. If this is low-emphasis progressive disclosure or a card-level action, use
   `Button.Link`.
4. If the control has no visible text label, use `IconButton.Primary` or
   `IconButton.Secondary` through `IconButton` instead of `Button`.
5. If the action navigates to another URL, pass `href`.
6. If the action changes UI state, opens a drawer/modal, submits, resets or
   triggers JavaScript, do not pass `href`; render the native `<button>` branch.

## 4. Variant Decision Rules

### Button.Primary

UX role: highest-emphasis action in a local decision area.

Use when:

- the action is the main next step;
- the action advances the conversion path;
- the user should notice this action before alternatives;
- the action submits a primary form or starts a key workflow.

Common contexts:

- hero primary CTA;
- section-level CTA;
- form submit;
- drawer or modal primary confirmation;
- major callout action.

Conversion intent:

- start a project;
- contact;
- submit;
- continue;
- confirm;
- begin a guided process.

Do not use when:

- there are multiple equal actions in the same local context;
- the action only reveals details;
- the action is a minor card-level link;
- a destructive action would need a dedicated destructive component contract.

### Button.Secondary

UX role: supporting or alternative action.

Use when:

- the action sits beside a primary action;
- the action helps exploration without becoming the main conversion step;
- the action cancels, resets or returns from a flow;
- the user may need a lower-risk alternative.

Common contexts:

- paired hero action;
- secondary section CTA;
- modal cancel/back action;
- form reset or "send another" action;
- navigation-adjacent action with lower priority.

Interaction intent:

- explore;
- learn more;
- compare;
- go back;
- cancel;
- reset;
- view an alternate path.

Do not use when:

- the action should clearly dominate the local context;
- the action is only inline text disclosure;
- the action should be visually silent inside dense cards or metadata.

### Button.Link

UX role: low-emphasis text action with optional icon.

Use when:

- the action is card-level or inline;
- the action reveals details without needing a strong visual container;
- the action is useful but not the main conversion target;
- the surrounding content is already the primary visual object.

Common contexts:

- project card action;
- "read more";
- "open case";
- "view details";
- section footer text action;
- documentation "check component" links.

Interaction intent:

- progressive disclosure;
- open detail view;
- navigate to supporting information;
- expose a secondary path without increasing visual noise.

Do not use when:

- the action is the main CTA in a hero or major callout;
- the action needs strong visibility;
- the action is icon-only;
- the text label is vague.

### IconButton.Primary

UX role: highest-emphasis icon-only action in a compact local context.

Use when:

- the action is icon-only but still the main action in its local area;
- the control sits in a dense toolbar, card corner, drawer header or compact row;
- the icon action should visually match `Button.Primary`;
- the action is the dominant compact control in a focused interaction, such as
  opening the current item, confirming a compact choice or advancing one main
  step.

Common contexts:

- compact slider control when advancing the current slide is the primary action;
- featured carousel next action when only one control needs emphasis;
- card corner action when the card title already explains the object;
- drawer or modal compact confirm/open action;
- media preview or component preview controls where a text label would be
  redundant.

Interaction intent:

- advance;
- open;
- confirm;
- continue;
- focus the primary interactive path without adding a visible text label.

Do not use when:

- a visible text label would reduce ambiguity;
- multiple icon-only primary actions compete in the same local area;
- the action is low-emphasis or only utility-level;
- the icon meaning depends on hidden knowledge or uncommon visual metaphor;
- the control appears in a repeated dense list where many primary icon buttons
  would create visual noise.

### IconButton.Secondary

UX role: supporting or utility icon-only action.

Use when:

- the action is icon-only and lower emphasis than the primary path;
- the control supports navigation, closing, stepping, previewing or opening details;
- the icon action should visually match `Button.Secondary`;
- the surrounding content already explains the action context.

Common contexts:

- slider previous/next controls;
- carousel arrows;
- previous/next slide navigation;
- simple component navigation where labels would repeat obvious direction;
- calendar previous/next controls;
- drawer close controls;
- card or row utility actions;
- compact toolbar actions;
- media gallery controls;
- pagination-style stepping inside one component.

Interaction intent:

- move previous;
- move next;
- close;
- open a compact detail;
- preview;
- step through related items;
- navigate inside a local component without increasing copy density.

Do not use when:

- the icon-only action is the main conversion action;
- the icon meaning is unclear without a visible label or accessible name;
- the action needs a destructive, warning or custom status contract;
- the action changes critical data and needs explicit visible wording;
- multiple adjacent icon buttons would be ambiguous without visible labels or
  tooltips.

## 5. Context Of Use

Valid contexts:

- hero and intro action groups;
- section header actions;
- card actions;
- forms;
- drawers and modals;
- callout cards;
- documentation controls;
- navigation-adjacent utility actions;
- sliders, carousels and local previous/next controls;
- compact component navigation where the direction or action is already obvious.

Rules:

- Use one `Button.Primary` per local decision area.
- A primary and secondary button may appear together in a `ButtonGroup`.
- Do not place multiple primary buttons side by side unless each belongs to a
  separate repeated item.
- Prefer `Button.Link` inside repeated cards when every card has the same
  low-emphasis action.
- Use `IconButton.Secondary` for most slider arrows and previous/next controls.
- Use `IconButton.Primary` only when the icon-only control is the dominant local
  action, not merely a utility control.
- Pair `IconButton.Secondary` controls for symmetrical previous/next navigation.
- For copy-to-clipboard actions, choose `Button` or `IconButton` by visual
  hierarchy first, then attach the `ClipboardCopy` behavior with
  `data-clipboard-*` attributes.
- Do not mix text Button and IconButton for the same action unless one is a
  responsive alternative and both share the same accessible name.

## 6. Accessibility Pattern

Accessible name:

- Every Button must have a visible text label or an explicit `aria-label`.
- Prefer visible labels. Use `aria-label` only when the visible label is absent
  or too short to describe an icon-only or compact action.
- Every `IconButton` must receive the required `label` prop. The component maps
  it to `aria-label`; optional `title` only supplements that accessible name.
- Previous/next controls must name the controlled object when possible, such as
  `aria-label="Next slide"` or `aria-label="Previous project"`.
- If an action is icon-only, use `IconButton`, not `Button`.

Semantic element:

- Passing `href` renders an anchor and means navigation.
- Omitting `href` renders a native button and means UI action.
- Do not use an anchor for modal, drawer, tab, reset or JavaScript-only actions.
- Do not use a button for navigation to another URL.

Icon behavior:

- The built-in arrow icon is decorative and should stay `aria-hidden="true"`.
- If an icon communicates meaning that is not present in text, change the text
  label or add an accessible label. Do not rely on the icon alone.
- IconButton keeps the icon centered in a square 1:1 control. Do not add
  padding-driven sizing to `IconButton`; use `data-component-size`.
- For directional controls, use icons that match the movement direction.
- If the icon is not universally recognizable, use a text Button or add a
  visible label through a nearby component pattern.

Disabled behavior:

- Use native `disabled` for real `<button>` controls.
- Avoid disabled anchors. If navigation is unavailable, do not render the link or
  explain the unavailable state in surrounding UI.
- `aria-disabled="true"` can communicate disabled state, but it does not replace
  native disabling for anchors with `href`.

Focus behavior:

- Do not remove `:focus-visible`.
- Focus indication must remain visible on every color theme and state.

## 7. Content Pattern

Button labels should be concrete and action-led.

Prefer:

- verb + object;
- user outcome language;
- short labels that still explain the result.

Good labels:

- `Discuss a project`
- `Explore process`
- `Open case`
- `Send project context`
- `View details`
- `Send another message`

Avoid:

- `Click here`
- `More`
- `Submit` when the submitted object is unclear
- `Learn more` when the destination can be named more specifically

## 8. Size And Density Rules

Available sizes:

- `small`
- `medium`
- `large`

Rules:

- Use `large` for prominent CTAs, hero actions and high-emphasis section actions.
- Use `medium` for standard controls in balanced UI contexts.
- Use `small` for compact actions, card-level actions and dense interface areas.
- IconButton uses the same size names, but its visual size comes from
  `--component-min-height` and a square 1:1 ratio.
- Do not use `tiny`; it is not part of the current `data-component-size`
  contract.
- Do not create one-off sizes with local CSS. Update `component-sizes.css` only
  when a repeated size profile is needed.

## 9. Composition Rules

Allowed composition:

- `ButtonGroup` for paired or grouped actions.
- `SectionHeader` actions for section-level CTAs.
- Cards for card-level actions, usually `Button.Link`.
- Forms for submit, reset or alternate form actions.
- Drawers/modals for primary and secondary decisions.

Rules:

- In an action pair, order the main action first unless the local UX pattern
  deliberately favors cancellation first.
- Use `Button.Primary` plus `Button.Secondary` for two visible choices.
- Use `ButtonGroup` whenever two or more related action controls sit together.
- ButtonGroup is not a button variant. It is a horizontal wrapper with
  `gap: var(--gap-button-group)`.
- Use `Button.Link` when the action should remain visually subordinate.
- Use `IconButton.Secondary` for paired previous/next controls in sliders and
  carousels.
- Use `IconButton.Primary` sparingly, usually as a single compact dominant
  action.
- Do not wrap Button in extra anchors or buttons.
- Give every SwitchButton a stable visible label. Do not place an unlabeled
  switch in a ButtonGroup.

## 10. Implementation Contract

Code rules:

- Import and render `src/components/atoms/actions/Button.astro`.
- Import and render `src/components/atoms/actions/IconButton.astro` for `IconButton`
  variants.
- Import and render `src/components/molecules/actions/ButtonGroup.astro` when arranging
  related action controls.
- Use the `variant` prop to choose `primary`, `secondary` or `link`.
- For `IconButton`, use only `variant="primary"` or `variant="secondary"`.
- Use the `size` prop to choose `small`, `medium` or `large`.
- Use `href` only for navigation.
- Use `type` for non-navigation button behavior.
- For clipboard behavior, use `type="button"` and read
  `.agentic-rules/behaviors/clipboard-copy.md`.
- Keep `data-component-name` and `data-component-size` rendered on the root.
- Keep color tokens in `src/styles/tokens/color-components.css`.
- Do not create `--icon-button-*` color tokens. IconButton uses
  `--button-primary-*` and `--button-secondary-*`.
- Keep size profiles in `src/styles/tokens/component-sizes.css`.
- Keep ButtonGroup spacing tied to `--gap-button-group`.
- Keep SwitchButton on a native button with `role="switch"`, synchronize
  `aria-checked` with `data-switch-state`, and preserve the `switch-change`
  event contract.
- Update `/design-system/components` when the public Button contract changes.
- Update this rule file when Button variant decision logic changes.

## 11. Do / Do Not

Do:

- Use `Button.Primary` for the most important local action.
- Use `Button.Secondary` for alternate or supporting actions.
- Use `Button.Link` for low-emphasis detail or supporting actions.
- Use `IconButton.Primary` for the most important icon-only local action.
- Use `IconButton.Secondary` for supporting icon-only actions.
- Use visible labels by default.
- Use the native button branch for UI state changes.
- Use the anchor branch for navigation.
- Use `data-clipboard-copy` on Button or IconButton when the action copies a
  known value.
- Use `ButtonGroup` for horizontal action clusters.

Do not:

- Use more than one primary button in one local decision area.
- Use `Button.Link` as the main hero CTA.
- Use `href="#"` for JavaScript actions.
- Hide the label without providing an accessible name.
- Use Button for icon-only controls.
- Add padding-driven custom sizing to Button Icon.
- Create a dedicated copy button variant or local clipboard script.
- Treat `ButtonGroup` as another button variant.
- Create local button lookalikes in page or card CSS.
- Add one-off size or color overrides without updating token contracts.

## 12. Examples

Good:

```astro
<Button href="/contact">Discuss a project</Button>

<Button variant="secondary" href="/process">
  Explore process
</Button>

<Button variant="link" type="button" data-open-case={slug}>
  Open case
</Button>

<Button type="submit">Send project context</Button>

<ButtonGroup>
  <Button href="/contact">Discuss a project</Button>
  <Button variant="secondary" href="/process">Explore process</Button>
</ButtonGroup>

<IconButton
  variant="secondary"
  type="button"
  label="Previous slide"
  data-slider-prev
>
  <ArrowLeft />
</IconButton>

<IconButton
  variant="secondary"
  type="button"
  label="Next slide"
  data-slider-next
>
  <ArrowRight />
</IconButton>

<IconButton
  variant="primary"
  href={activeProjectUrl}
  label="Open active project"
>
  <ArrowRightDown />
</IconButton>

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

Bad:

```astro
<a class="custom-button" href="/contact">Contact</a>

<Button variant="link" href="/contact">
  Main CTA
</Button>

<Button type="button" data-open-modal>
  Open
</Button>

<Button aria-label="Open">
  <span aria-hidden="true">-></span>
</Button>

<IconButton type="button">
  <ArrowRight />
</IconButton>

<IconButton
  class="slider-custom-next"
  type="button"
  label="Next"
>
  <ArrowRight />
</IconButton>
```
