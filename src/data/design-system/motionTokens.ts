export interface MotionTokenRow {
  token: string;
  defaultValue: string;
  reducedValue: string;
  role: string;
}

export interface MotionTokenGroup {
  id: string;
  title: string;
  description: string;
  rows: MotionTokenRow[];
}

export const motionFoundationGroups: MotionTokenGroup[] = [
  {
    id: "motion-foundation-easings",
    title: "Easing curves",
    description:
      "Shared curves establish the character of state changes, entrances, and exits. Reduced Motion keeps curves available while durations collapse.",
    rows: [
      {
        token: "--motion-ease-standard",
        defaultValue: "ease-out",
        reducedValue: "ease-out",
        role: "Default curve for short state changes and feedback.",
      },
      {
        token: "--motion-ease-premium-in",
        defaultValue: "cubic-bezier(0.64, 0, 0.78, 0)",
        reducedValue: "cubic-bezier(0.64, 0, 0.78, 0)",
        role: "Exit curve for overlays and closing surfaces.",
      },
      {
        token: "--motion-ease-premium-out",
        defaultValue: "cubic-bezier(0.22, 1, 0.36, 1)",
        reducedValue: "cubic-bezier(0.22, 1, 0.36, 1)",
        role: "Entrance curve for overlays and deliberate reveals.",
      },
    ],
  },
];

export const motionSemanticGroups: MotionTokenGroup[] = [
  {
    id: "motion-semantic-shared",
    title: "Shared interaction timings",
    description:
      "Semantic timings cover repeated interaction roles. Components consume these contracts instead of introducing local durations.",
    rows: [
      {
        token: "--motion-duration-fast",
        defaultValue: "180ms",
        reducedValue: "0ms",
        role: "Default duration for hover, color, and compact state changes.",
      },
      {
        token: "--motion-duration-surface-enter",
        defaultValue: "360ms",
        reducedValue: "0ms",
        role: "Entrance duration for a substantial surface or navigation region.",
      },
      {
        token: "--motion-duration-disclosure",
        defaultValue: "600ms",
        reducedValue: "0ms",
        role: "Deliberate open and close duration for disclosure panels.",
      },
      {
        token: "--motion-transition",
        defaultValue: "180ms ease-out",
        reducedValue: "0ms ease-out",
        role: "Canonical transition shorthand for compact state changes.",
      },
    ],
  },
];

export const motionComponentGroups: MotionTokenGroup[] = [
  {
    id: "motion-component-mobile-menu",
    title: "Mobile menu sequence",
    description:
      "Component-level timings coordinate one reusable navigation sequence. They remain named for the owning component and are not general spacing-style utilities.",
    rows: [
      {
        token: "--motion-duration-mobile-menu-reveal",
        defaultValue: "420ms",
        reducedValue: "0ms",
        role: "Mobile menu shell entrance.",
      },
      {
        token: "--motion-duration-mobile-menu-close",
        defaultValue: "260ms",
        reducedValue: "0ms",
        role: "Mobile menu shell exit.",
      },
      {
        token: "--motion-duration-mobile-menu-link",
        defaultValue: "340ms",
        reducedValue: "0ms",
        role: "Individual navigation-link entrance.",
      },
      {
        token: "--motion-duration-mobile-menu-footer",
        defaultValue: "370ms",
        reducedValue: "0ms",
        role: "Footer action entrance.",
      },
      ...[
        ["--motion-delay-mobile-menu-link-1", "290ms", "First link delay."],
        ["--motion-delay-mobile-menu-link-2", "340ms", "Second link delay."],
        ["--motion-delay-mobile-menu-link-3", "390ms", "Third link delay."],
        ["--motion-delay-mobile-menu-link-4", "440ms", "Fourth link delay."],
        ["--motion-delay-mobile-menu-link-5", "490ms", "Fifth link delay."],
        ["--motion-delay-mobile-menu-link-6", "550ms", "Sixth link delay."],
        ["--motion-delay-mobile-menu-footer", "680ms", "Footer action delay."],
      ].map(([token, defaultValue, role]) => ({
        token,
        defaultValue,
        reducedValue: "0ms",
        role,
      })),
    ],
  },
];

export const motionAgenticRules = [
  {
    title: "Use semantic intent",
    text: "Choose a shared interaction role before adding a duration. Add component-level timing only for a coordinated sequence owned by that component.",
  },
  {
    title: "Keep Reduced Motion complete",
    text: "Every reusable duration or delay must define a Reduced Motion value. Remove transform or keyframe movement in the component when zero duration alone is insufficient.",
  },
  {
    title: "Do not animate layout casually",
    text: "Prefer opacity and transform for decorative transitions. Animate layout only when the disclosure relationship requires it and browser behavior is validated.",
  },
  {
    title: "Keep Figma representational",
    text: "Figma mirrors timing values and modes for documentation. Runtime event handling, media queries, focus, and animation completion remain code-owned.",
  },
];
