# Typography

Status: universal knowledge.

Typography communicates hierarchy, voice, density, and rhythm before content is
fully read.

## Required Decisions

A project typography contract should define:

- production typefaces and licensing;
- display and functional roles;
- semantic role hierarchy;
- size, weight, line-height, and tracking relationships;
- preferred line lengths;
- casing and punctuation behavior;
- numeral and code treatment when relevant;
- responsive transformations;
- fallback behavior;
- optical exceptions.

## Typographic Hierarchy

Do not define hierarchy through size alone.

Combine:

- scale;
- weight;
- width;
- line height;
- tracking;
- casing;
- color;
- position;
- surrounding space.

Every visual text role must remain independent from HTML heading semantics.
Semantic heading order is code-owned; visual roles are token- and style-owned.

## Contrast And Pairing

Typeface pairing needs a reason. Possible relationships include:

- contrast between expressive display and neutral functional text;
- one family with controlled weight and width variation;
- serif and sans roles;
- proportional and monospaced roles.

Avoid adding a second typeface only to make the system feel more designed.

## Measure And Rhythm

Specify target line-length ranges for:

- large display text;
- introductory copy;
- body content;
- cards;
- captions and labels.

Line height should support the role, typeface, size, and measure. It should not
be selected from a generic scale without visual review.

## Component Typography

For each signature component, define:

- text role;
- case;
- weight;
- tracking;
- alignment;
- truncation or wrapping behavior;
- relationship to icons;
- minimum and maximum content assumptions.

The same font token does not guarantee unity if components use unrelated
content density and alignment rules.

## Responsive Typography

Document which changes are:

- fluid;
- breakpoint-driven;
- fixed;
- composition-driven.

Test hierarchy with realistic long labels and translated content. A direction
that works only with short English fixtures is incomplete.

## Evidence

Provide:

- approved type specimens;
- representative component examples;
- heading and body combinations;
- dense and spacious contexts;
- mobile examples;
- explicit rejected treatments.
