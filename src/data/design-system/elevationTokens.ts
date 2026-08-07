export interface ElevationTokenRow {
  token: string;
  value: string;
  role: string;
}

export interface ElevationTokenGroup {
  id: string;
  title: string;
  description: string;
  rows: ElevationTokenRow[];
}

export const elevationTokenGroups: ElevationTokenGroup[] = [
  {
    id: "elevation-primitive-shadows",
    title: "Primitive shadow references",
    description:
      "Raw shadow compositions reuse the sizing scale and a stable neutral primitive. Components do not consume this layer directly.",
    rows: [
      {
        token: "--elevation-primitive-subtle",
        value: "0 1px 2px neutral-950 / 3%",
        role: "Minimal separation for a low-elevation surface.",
      },
      {
        token: "--elevation-primitive-raised",
        value: "0 8px 24px neutral-950 / 12%",
        role: "Low separation for a raised surface.",
      },
      {
        token: "--elevation-primitive-floating",
        value: "0 12px 32px neutral-950 / 12%",
        role: "Medium separation for a floating control or menu.",
      },
      {
        token: "--elevation-primitive-overlay",
        value: "0 12px 32px neutral-950 / 16%",
        role: "Strong separation for an overlay above page content.",
      },
      {
        token: "--elevation-primitive-control-raised",
        value: "0 1px 3px neutral-950 / 12%",
        role: "Compact separation for a raised interactive control.",
      },
      {
        token: "--elevation-primitive-control-thumb",
        value: "0 2px 4px neutral-950 / 8%, 0 4px 8px neutral-950 / 6%",
        role: "Two-layer depth for a thumb or draggable handle.",
      },
    ],
  },
  {
    id: "elevation-semantic-surfaces",
    title: "Semantic surface roles",
    description:
      "Reusable UI selects elevation by relationship to surrounding content, not by copied coordinates or blur values.",
    rows: [
      {
        token: "--elevation-surface-subtle",
        value: "var(--elevation-primitive-subtle)",
        role: "A surface with minimal separation from its parent.",
      },
      {
        token: "--elevation-surface-raised",
        value: "var(--elevation-primitive-raised)",
        role: "A surface lifted slightly from its parent.",
      },
      {
        token: "--elevation-surface-floating",
        value: "var(--elevation-primitive-floating)",
        role: "A temporary floating surface such as a menu.",
      },
      {
        token: "--elevation-surface-overlay",
        value: "var(--elevation-primitive-overlay)",
        role: "A high-priority overlay that must separate clearly from page content.",
      },
    ],
  },
  {
    id: "elevation-semantic-controls",
    title: "Semantic control roles",
    description:
      "Compact controls use dedicated elevation roles so their depth is not approximated with surface shadows or border effects.",
    rows: [
      {
        token: "--elevation-control-raised",
        value: "var(--elevation-primitive-control-raised)",
        role: "A compact interactive control lifted from its surrounding surface.",
      },
      {
        token: "--elevation-control-thumb",
        value: "var(--elevation-primitive-control-thumb)",
        role: "A switch, slider, or draggable thumb above its track.",
      },
    ],
  },
];

export const elevationAgenticRules = [
  {
    title: "Choose by relationship",
    text: "Use subtle, raised, floating, or overlay according to the surface relationship. Use control roles only for compact interactive elements.",
  },
  {
    title: "Keep rings separate",
    text: "Focus rings, status dots, borders, divider outlines, and colored attention halos are not elevation.",
  },
  {
    title: "Prefer existing aliases",
    text: "Reuse a semantic role first. Add a component alias when the component needs a stable named contract.",
  },
  {
    title: "Treat Figma effects as adapters",
    text: "Figma Effect Styles approximate CSS color-mix shadows. Astro remains authoritative for values and theme behavior.",
  },
];
