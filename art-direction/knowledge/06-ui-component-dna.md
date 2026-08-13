# UI Component DNA

Status: universal knowledge.

Component DNA is a recurring set of relationships that makes controls,
content objects, and sections feel like members of the same system.

## DNA Layers

Define component DNA across:

- typography;
- control height and density;
- padding ratios;
- radius and edge treatment;
- border and surface behavior;
- icon size and placement;
- accent placement;
- focus and interaction treatment;
- motion;
- content hierarchy;
- recurring signature detail.

The signature must survive across different component roles without forcing
identical anatomy.

## Signature Components

Calibrate at least:

- Button;
- Input or FormField;
- Tag;
- SectionHeader;
- representative Card;
- Navigation;
- representative Section.

For every signature component, document:

- invariant traits;
- permitted variation;
- content assumptions;
- states;
- responsive behavior;
- token implications;
- Figma node or browser example;
- human approval state.

## Family Resemblance

Button and Input may share:

- height;
- edge treatment;
- typography rhythm;
- focus grammar;
- icon scale.

They should not necessarily share:

- color emphasis;
- interaction purpose;
- content density;
- every internal spacing value.

Family resemblance comes from controlled relationships, not identical styling.

## Visual Variants Versus API Variants

A visual exploration does not automatically justify a public prop.

Promote an exploration to a component variant only when:

- it represents a stable UX role;
- it is required in multiple real contexts;
- its accessibility and state behavior are defined;
- it can be named operationally;
- its token implications are reusable;
- both Astro and Figma can represent it without ambiguity.

## Calibration Before Propagation

Do not propagate a visual direction across the library until the calibration
set has been reviewed together. Components that look convincing in isolation
may conflict when assembled on one page.

## Component Brief Evidence

Use `art-direction/templates/component-visual-brief.md` before a major visual
redesign. Link approved references and distinguish:

- structural API decisions;
- visual-token decisions;
- component-local optical decisions;
- project content;
- exploratory ideas.
