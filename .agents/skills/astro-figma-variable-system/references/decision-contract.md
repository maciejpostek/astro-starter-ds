# Variable decision contract

Use this contract before adding or renaming any variable. The live repository
architecture remains authoritative if it is stricter.

## 1. Identify meaning before value

For each requested variable, write down:

1. domain: color, size, typography, layout, motion, or elevation;
2. owner: component, dependency, use case, global semantic, or primitive;
3. role: what the consumer means, not the current numeric value;
4. behavior: fixed, fluid clamp, or responsive override;
5. consumers and whether their behavior may change.

Equal values do not imply equal meaning. Different values do not automatically
justify a new semantic role.

## 2. Reuse and approval decision

Use this order:

1. Reuse one exact semantic match.
2. If several matches remain, return `ambiguous` with candidates and evidence.
3. If no match exists, return `gap` and create the repository's exact
   `tokenDraft`.
4. Change only the names, aliases, values, consumers, source paths, and
   projections recorded in the approved draft.

An explicit request such as “add the approved `gap/global/large = 20px` draft
to Astro and Figma” approves that exact change. A request such as “the scale is
too sparse” does not approve a new public token.

## 3. Naming an ordinal scale

Follow the existing family's vocabulary. Use one semantic axis, for example:

`none → tiny → xsmall → small → medium → large → xlarge → xxlarge → xxxlarge`

The exact labels come from the live family; do not introduce a second synonym
such as both `regular` and `medium` without a documented migration.

Rules:

- a tier name expresses relative semantic rank;
- one tier has one canonical token;
- raw numbers do not replace semantic names at the semantic layer;
- `fixed`, `fluid`, `clamp`, `min`, and `max` are not tier names;
- implementation behavior belongs in values, modes, or CSS rules;
- collection and path names express ownership and domain, not visual accidents.

When inserting a tier, keep names aligned with order. If the existing `large`
is now the fourth tier and the new value is the third, rename the old token to
the next larger role and migrate all consumers. Preserve identity in Figma.

## 4. Prove monotonicity

Create an ordered table for every scale before writing:

| Tier | Min | Max | Astro token | Consumers |
| --- | ---: | ---: | --- | --- |
| ... | ... | ... | ... | ... |

For adjacent tiers `A < B`, require:

- `Min(A) <= Min(B)`
- `Max(A) <= Max(B)`

Prefer strict increase unless intentional equality is documented. Check all
ordered modes, not just the currently visible or default mode.

If one endpoint is larger and the other smaller, the ranges cross. This is not
a naming problem. Stop and choose one approved resolution:

- change endpoints so the tiers are monotonic;
- change the semantic role or owner;
- migrate consumers to the correct existing tier;
- use a responsive override when the behavior is genuinely breakpoint-specific.

Never resolve a crossing range with `-fluid`, `-fixed`, or a second collection.

## 5. Responsive behavior

Use the model already assigned by the architecture:

- fixed: one value; identical Figma Min and Max values;
- fluid: one semantic/component CSS token containing `clamp()`; Figma Min and
  Max store the clamp endpoints;
- responsive override: one token whose value is overridden at an approved
  media or container query.

Primitives remain fixed. Do not put `clamp()` or breakpoints in size primitives.
Min and Max are value modes, not breakpoint names and not independent tokens.

## 6. Safe rename plan

Before renaming, enumerate:

- CSS definition and every `var()` reference;
- token registry owner and projections;
- documentation assertions and examples;
- Figma variable ID, name, aliases, scopes, and code syntax;
- dependent variables and component bindings.

Rename in place, update all consumers, validate, then remove the old public
name only if the approved plan says to remove it. Do not keep accidental dual
names merely to make validation pass.

## 7. Block conditions

Stop before mutation when:

- ownership is ambiguous;
- the required primitive or semantic alias is absent and not approved;
- adjacent tiers are non-monotonic;
- renaming would change consumer meaning outside the approved scope;
- a Figma variable cannot be identified uniquely;
- preserving bindings would require destructive recreation;
- Astro and Figma values disagree without an approved source of truth.

Return evidence, the smallest coherent draft, and the single decision needed
from the user.
