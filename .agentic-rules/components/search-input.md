# SearchInput

Status: active.

- Manifest id: `search-input`
- Figma canonical node: `223:137`
- Figma page key: `inputs`
- Astro source: `src/components/base-components/inputs/SearchInput.astro`
- Role: molecule
- Sync status: `mapped`

## UX purpose

Collect one text query while making search intent immediately recognizable and allowing an entered query to be cleared without replacing the whole field with a custom widget.

## Communication role

- Goals: none

This component supports the local interaction or content structure described in UX purpose. It does not define a campaign narrative. Use the selected project strategy and voice when authoring its text; keep client facts in project context.

## Use when

- A text field filters or searches a list, catalog, table, documentation set or other result collection.
- Search is the primary meaning of the field and should be reinforced with the fixed search icon.
- Users benefit from clearing the complete query through one adjacent action.

## Avoid when

- The field collects general free-form data; use [Input](/design-system/base-components/inputs/input).
- The interaction selects from a finite set of known options; use Select or another appropriate selection control.
- Search requires filters, suggestions, recent queries or result navigation as one composite experience; compose SearchInput inside a dedicated search pattern rather than expanding its API.

## Content contract

- `label` provides the input's accessible name and describes the searchable collection, not merely the word “search”.
- Placeholder text is supplementary and may provide a short query example; it does not replace a persistent visible label when the surrounding form requires one.
- `clearLabel` names the action, for example “Clear documentation search”.
- The query remains one plain text value. Structured filters and tokens belong outside SearchInput.

## Composition and placement

- Place SearchInput immediately before or inside the result collection it controls.
- Keep the fixed `search` icon at the leading edge and the fixed `close` clear action at the trailing edge.
- SearchInput composes canonical Input behavior. Do not recreate its border, focus, disabled or Control Size contracts locally.
- The caller owns filtering, request timing, result rendering and any loading, empty or error feedback.

## Responsive behavior

- Primary strategy: `intrinsic`
- Mechanisms and references: canonical Input `inline-size: 100%`, `min-inline-size: 0`, fixed icon slots and `data-control-size` geometry.
- Container queries: none.
- Viewport queries: none.
- Reflow, order and visibility: Search icon, native field and clear action remain in one source-ordered control; the field shrinks with its parent without hiding or duplicating either action.

## Accessibility and required behavior

- Preserve the native `<input type="search">` and its text editing, form, autofill and virtual-keyboard behavior.
- The input requires an accessible name through `label`, while the nested clear button requires its own `clearLabel`.
- Show the clear action only when the input contains a value; native keyboard activation must clear the value, emit an input event and return focus to the field.
- Disabled state disables both the input and clear action.
- `validation="error"` sets `aria-invalid="true"` through Input; connect the matching Hint through FormField and `aria-describedby`. Success and Warning use the shared visible message contract without setting `aria-invalid`.
- Search result counts or asynchronous status changes are announced by the composing search pattern, not by SearchInput itself.

## Related components

- [Input](/design-system/base-components/inputs/input) collects non-search textual values and owns the shared field styling contract.
- [FormField](/design-system/base-components/inputs/form-field) supplies the visible label, Hint and validation relationship around SearchInput.
- [Button](/design-system/base-components/buttons/button) triggers an explicit submitted action when search is not performed as the query changes.
- [Tag](/design-system/base-components/tag) may represent applied structured filters next to SearchInput.

## Naming and token contract

Use the canonical identity, public root class, controlled `data-*` attributes and registered `tokenGroups` from `componentArchitecture.json` and `tokenArchitecture.json`. Resolve existing groups before styling; do not declare local custom properties or invent namespaces. A confirmed gap requires an approved `tokenDraft` before implementation.

## Core decision

Choose SearchInput for one searchable text query with a fixed search affordance and a native clear action; keep result behavior and richer filtering composition outside the component.
