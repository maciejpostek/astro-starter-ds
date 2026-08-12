# Documentation Benchmark Boundary

Status: approved internal composition reference.

The documentation may use the supplied Momentic screenshots as a structural
benchmark for information hierarchy: fixed left navigation, a quiet top-level
bar, centered reading column, sticky right anchors, modal search and terminal
Previous/Next navigation.

This approval is limited to the internal documentation shell. It does not
authorize copying third-party source code, assets, logos, product content,
component APIs, CSS declarations, raw measurements or color values. Every
implementation value must resolve through the local component registry,
documentation registry and canonical Astro Design System token aliases.

The benchmark does not authorize a public Design System component. New helpers
remain under `src/components/_internal/documentation` unless a later explicit
promotion request passes the public component readiness gates.
