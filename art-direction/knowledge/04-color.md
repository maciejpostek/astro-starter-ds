# Color

Status: universal knowledge.

Color must express hierarchy, identity, interaction, and state without
replacing semantic structure.

## Required Decisions

A project color contract should define:

- primitive palette;
- semantic surface, text, border, and icon roles;
- component-specific roles only when stable;
- Light and Dark behavior when required;
- accent allocation;
- neutral-temperature preference;
- contrast targets;
- state colors;
- image and illustration relationships;
- forbidden combinations.

## Color Hierarchy

Specify which color roles are:

- dominant;
- supporting;
- accent;
- semantic state;
- decorative;
- reserved.

An accent is effective when its scarcity and role are controlled. Repeated
accent use across every component removes hierarchy.

## Contrast

Contrast serves:

- readability;
- hierarchy;
- state recognition;
- separation;
- focus.

Check contrast in context. A token pair may pass a numerical threshold while
still producing weak hierarchy or excessive visual weight.

## Surface Logic

Define how surfaces relate:

- canvas;
- section;
- card;
- raised;
- floating;
- overlay;
- selected;
- interactive.

Do not use arbitrary background alternation as a substitute for section
composition.

## Brand And Semantic Color

Brand accent and semantic status colors are separate responsibilities.

Do not use a brand accent as error, warning, or success unless the project
contract explicitly defines and validates that relationship.

## Color Evidence

Useful evidence includes:

- palette source;
- approved brand applications;
- component state sheets;
- text and surface combinations;
- light and dark pairs;
- examples of restrained and excessive accent use;
- accessibility checks.
