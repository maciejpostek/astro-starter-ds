# Figma File Architecture

Status: generated projection
Canonical data: `src/data/design-system/componentArchitecture.json`

Page names use this grammar:

- category: `<icon><two spaces>・<one space><Title Case label>`
- child: `<five ASCII spaces>↪<two spaces><icon><two spaces><Title Case label>`

Every child page uses exactly five ASCII spaces before the arrow. Icons are
Figma navigation metadata only. Exactly one empty page named `---` separates
adjacent top-level categories. Divider pages are Figma-only navigation metadata;
they do not map to Astro folders, component records, Variables, or public APIs.

```text
◈  ・ Architecture
     ↪  ◈  Variables
     ↪  ◈  Component Model
---
✣  ・ Foundations
     ↪  ✣  Color
     ↪  ✣  Typography
     ↪  ✣  Sizing
     ↪  ✣  Layout
     ↪  ✣  Motion
     ↪  ✣  Elevation
---
◆  ・ Assets
     ↪  ◆  Icons
     ↪  ◆  Logos
     ↪  ◆  Images
     ↪  ◆  Flags
     ↪  ◆  Illustrations
---
❖  ・ Base Components
     ↪  ❖  Buttons
     ↪  ❖  Switch
     ↪  ❖  Inputs
     ↪  ❖  Checkbox & Radio
     ↪  ❖  Select
     ↪  ❖  File Upload
     ↪  ❖  Form Structure
     ↪  ❖  Tabs
     ↪  ❖  Accordion
     ↪  ❖  Progress Bar
     ↪  ❖  Tooltip
     ↪  ❖  Hint
     ↪  ❖  Feedback Messages
     ↪  ❖  Popup
     ↪  ❖  Dividers
     ↪  ❖  Ratio
     ↪  ❖  Breadcrumbs
     ↪  ❖  Pagination
     ↪  ❖  Tag
▦  ・ Website Patterns
     ↪  ❖  Eyebrow
     ↪  ▦  Bullet Points
     ↪  ▦  Content
     ↪  ▦  Navigation
     ↪  ▦  Announcements & Banners
     ↪  ▦  Hero
     ↪  ▦  Page Headers
     ↪  ▦  Ratings & Reviews
     ↪  ▦  Stats & Metrics
     ↪  ▦  Testimonials & Stories
     ↪  ▦  Brand & Logo Proof
     ↪  ▦  Features
     ↪  ▦  How It Works
     ↪  ▦  Integrations & Security
     ↪  ▦  Pricing & Comparison
     ↪  ▦  Before & After
     ↪  ▦  Filtering & Search
     ↪  ▦  Tabbed Content
     ↪  ▦  Sliders & Carousels
     ↪  ▦  CTA
     ↪  ▦  FAQ
     ↪  ▦  Blog & Resources
     ↪  ▦  Rich Text
     ↪  ▦  Newsletter & Lead Capture
     ↪  ▦  Careers
     ↪  ▦  Team
     ↪  ▦  Contact
     ↪  ▦  Footer
---
▣  ・ Examples & Templates
     ↪  ▣  Component Recipes
     ↪  ▣  Starters
     ↪  ▣  Landing Templates
---
◌  ・ Workspace
     ↪  ◌  Internal Parts
     ↪  ◌  Sandbox
     ↪  ◌  Visual Calibration
```

Use stable page and node IDs from the manifest. Content `targetOrder` values
exclude divider metadata; the generated sequence above is the canonical physical
page order. Content `figmaCurrentIndex` values likewise exclude dividers, while
divider records use physical Figma indices. Graphik-blocked differences must
never be repaired by cloning or recreating a master.

Current controlled order differences: 57.
