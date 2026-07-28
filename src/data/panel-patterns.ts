export type PanelTone = "neutral" | "accent";

export interface PanelPatternSegment {
  /**
   * Segment width in source units. Empty segments are structural spacers.
   * Visible segments use `tone`.
   */
  size: number;
  tone?: PanelTone;
}

export interface PanelPatternGroup {
  rows: PanelPatternSegment[][];
}

export interface PanelPatternPreset {
  label: string;
  sourceWidth: number;
  sourceHeight: number;
  rowHeight: number;
  groupGap: number;
  totalWidth: number;
  height: string;
  mobileHeightScale: number;
  coreGroups: PanelPatternGroup[];
  extension?: {
    width: number;
    mode: "neutralize-core";
  };
}

export const panelPatternPresets = {
  heroPrimary: {
    label: "Hero primary modular panel pattern",
    sourceWidth: 738,
    sourceHeight: 120.097,
    rowHeight: 9.139,
    groupGap: 18.923,
    totalWidth: 936,
    height: "5.833rem",
    mobileHeightScale: 0.9,
    extension: {
      width: 198,
      mode: "neutralize-core"
    },
    coreGroups: [
      {
        rows: [
          [
            { size: 25.133 },
            { size: 171.362 },
            { size: 541.505 }
          ],
          [
            { size: 89.108 },
            { size: 31.988, tone: "neutral" },
            { size: 139.375 },
            { size: 258.186, tone: "neutral" },
            { size: 109.672 },
            { size: 109.672, tone: "accent" }
          ],
          [
            { size: 89.108, tone: "neutral" },
            { size: 31.988 },
            { size: 139.375, tone: "neutral" },
            { size: 258.186 },
            { size: 109.672, tone: "accent" },
            { size: 109.672 }
          ]
        ]
      },
      {
        rows: [
          [
            { size: 219.344, tone: "neutral" },
            { size: 258.186 },
            { size: 260.471, tone: "neutral" }
          ],
          [
            { size: 303.882, tone: "neutral" },
            { size: 22.848 },
            { size: 411.269, tone: "neutral" }
          ],
          [
            { size: 738, tone: "neutral" }
          ]
        ]
      },
      {
        rows: [
          [
            { size: 25.133 },
            { size: 171.362 },
            { size: 541.505 }
          ],
          [
            { size: 239.907, tone: "neutral" },
            { size: 63.975 },
            { size: 141.659, tone: "accent" },
            { size: 162.223 },
            { size: 130.235, tone: "neutral" }
          ],
          [
            { size: 303.882, tone: "accent" },
            { size: 141.659 },
            { size: 162.223, tone: "neutral" },
            { size: 130.235 }
          ]
        ]
      }
    ]
  },
  fieldStrategy: {
    label: "Strategy field modular panel pattern",
    sourceWidth: 480,
    sourceHeight: 78,
    rowHeight: 10,
    groupGap: 18,
    totalWidth: 480,
    height: "5.5rem",
    mobileHeightScale: 0.95,
    coreGroups: [
      {
        rows: [
          [
            { size: 64 },
            { size: 96, tone: "neutral" },
            { size: 128 },
            { size: 64, tone: "accent" },
            { size: 128 }
          ],
          [
            { size: 64, tone: "neutral" },
            { size: 96 },
            { size: 128, tone: "neutral" },
            { size: 64 },
            { size: 128, tone: "neutral" }
          ],
          [
            { size: 160 },
            { size: 128, tone: "neutral" },
            { size: 64 },
            { size: 128, tone: "neutral" }
          ]
        ]
      },
      {
        rows: [
          [
            { size: 128, tone: "neutral" },
            { size: 96 },
            { size: 96, tone: "neutral" },
            { size: 160 }
          ],
          [
            { size: 64 },
            { size: 160, tone: "neutral" },
            { size: 96 },
            { size: 160, tone: "neutral" }
          ],
          [
            { size: 224, tone: "neutral" },
            { size: 96 },
            { size: 160, tone: "neutral" }
          ]
        ]
      }
    ]
  },
  fieldDesign: {
    label: "Design field modular panel pattern",
    sourceWidth: 480,
    sourceHeight: 78,
    rowHeight: 10,
    groupGap: 18,
    totalWidth: 480,
    height: "5.5rem",
    mobileHeightScale: 0.95,
    coreGroups: [
      {
        rows: [
          [
            { size: 96, tone: "neutral" },
            { size: 64 },
            { size: 160, tone: "neutral" },
            { size: 64 },
            { size: 96, tone: "accent" }
          ],
          [
            { size: 96 },
            { size: 64, tone: "neutral" },
            { size: 160 },
            { size: 64, tone: "neutral" },
            { size: 96 }
          ],
          [
            { size: 160, tone: "neutral" },
            { size: 80 },
            { size: 120, tone: "accent" },
            { size: 120, tone: "neutral" }
          ]
        ]
      },
      {
        rows: [
          [
            { size: 48 },
            { size: 192, tone: "neutral" },
            { size: 48 },
            { size: 192, tone: "neutral" }
          ],
          [
            { size: 48, tone: "neutral" },
            { size: 96 },
            { size: 192, tone: "neutral" },
            { size: 144 }
          ],
          [
            { size: 144 },
            { size: 96, tone: "accent" },
            { size: 48 },
            { size: 192, tone: "neutral" }
          ]
        ]
      }
    ]
  },
  fieldDevelopment: {
    label: "Development field modular panel pattern",
    sourceWidth: 480,
    sourceHeight: 78,
    rowHeight: 10,
    groupGap: 18,
    totalWidth: 480,
    height: "5.5rem",
    mobileHeightScale: 0.95,
    coreGroups: [
      {
        rows: [
          [
            { size: 120 },
            { size: 160, tone: "neutral" },
            { size: 80 },
            { size: 120, tone: "neutral" }
          ],
          [
            { size: 120, tone: "accent" },
            { size: 80 },
            { size: 160, tone: "neutral" },
            { size: 120 }
          ],
          [
            { size: 200, tone: "neutral" },
            { size: 80 },
            { size: 80, tone: "accent" },
            { size: 120, tone: "neutral" }
          ]
        ]
      },
      {
        rows: [
          [
            { size: 80, tone: "neutral" },
            { size: 120 },
            { size: 200, tone: "neutral" },
            { size: 80 }
          ],
          [
            { size: 80 },
            { size: 120, tone: "neutral" },
            { size: 80 },
            { size: 200, tone: "neutral" }
          ],
          [
            { size: 280, tone: "neutral" },
            { size: 80 },
            { size: 120, tone: "neutral" }
          ]
        ]
      }
    ]
  }
} satisfies Record<string, PanelPatternPreset>;

export type PanelPatternVariant = keyof typeof panelPatternPresets;

export const defaultPanelPatternVariant: PanelPatternVariant = "heroPrimary";
