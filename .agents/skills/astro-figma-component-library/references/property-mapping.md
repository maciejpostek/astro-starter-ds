# Astro to Figma property mapping

## Identity

The public master name equals the Astro component filename and exported
component identity. Figma uses Title Case values; code keeps its exact prop
values.

## Mapping table

| Astro contract | Figma representation |
| --- | --- |
| finite visual union prop | VARIANT |
| `data-*` interaction preview | State VARIANT |
| required or editable string | TEXT |
| optional visible child | BOOLEAN |
| Lucide icon or child master | INSTANCE_SWAP |
| repeatable or freely arranged children | SLOT |
| `data-component-size` | `Component Size` mode |
| Light/Dark theme | `Color Semantic` mode |
| fixed repeatable child with independent states | private Building Block inside SLOT |
| array that changes the parent shell | Count adapter only when SLOT is insufficient |
| HTML heading level | documentation only; preserve semantic HTML in Astro |
| native pseudo-class | Figma State; pseudo-class in production Astro |

## Rules

- Do not duplicate a mode as a variant axis.
- Do not create one variant per icon.
- Do not expose code-only props that have no visual consequence.
- Do not turn runtime IDs, URLs or form names into variant axes.
- Keep accessibility labels editable even when visually hidden.
- Prefer SLOT when designers need to add, remove, duplicate or reorder children
  without detaching the parent instance.
- Populate SLOT defaults and preferred values with existing reusable masters.
- Use `stretchChildOnInsert` for vertical or horizontal collections that should
  fill the slot counter-axis.
- Set minimum or maximum children only when the design contract has a real
  limit. A limit is guidance, not an Astro API restriction.
- Do not use SLOT for state, theme, size, a finite prop, a single optional
  element or a fixed hierarchy that is clearer without freeform editing.
- Use `_Parts/{Parent}.{Part}` for private repeatable pieces.
- Document every Count adapter as a Figma convenience, never a code limit.
