export type ArchitectureContextCost =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "very-high";

export interface ArchitectureOwnership {
  owner: string;
  readers: string[];
  writers: string[];
  validatorNodeIds: string[];
  contextCost: ArchitectureContextCost;
}

export interface ArchitectureNode {
  id: string;
  title: string;
  type: string;
  scope: string;
  concerns: string[];
  status: "current" | "proposed" | "deprecated";
  architectureState: "current" | "target" | "shared";
  sourcePaths: string[];
  ownership: ArchitectureOwnership;
  metadata?: Record<string, unknown>;
}

export interface ArchitectureStage {
  id: string;
  number: string;
  title: string;
  kind: "core" | "controls" | "optional" | "feedback";
  description: string;
  instanceIds: string[];
}

export interface ArchitectureNodeInstance {
  id: string;
  nodeId: string;
  stageId: string;
  stepNumber: string;
  title?: string;
  summary: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  order: number;
}

export interface ArchitectureViewConnection {
  id: string;
  sourceInstanceId: string;
  targetInstanceId: string;
  edgeId?: string;
  type:
    | "primary"
    | "conditional"
    | "context"
    | "repair"
    | "optional"
    | "feedback";
  label?: string;
  condition?: string;
}

export interface ArchitectureTrace {
  id: string;
  title: string;
  description: string;
  contextCost: ArchitectureContextCost;
  instanceIds: string[];
  connectionIds: string[];
  terminalInstanceIds: string[];
}

export interface ArchitecturePresentation {
  stages: ArchitectureStage[];
  instances: ArchitectureNodeInstance[];
  connections: ArchitectureViewConnection[];
  traces: ArchitectureTrace[];
}

export interface ArchitectureView {
  id: string;
  title: string;
  description?: string;
  presentation?: ArchitecturePresentation;
}

export interface ArchitectureSystemMap {
  nodes: ArchitectureNode[];
  views: ArchitectureView[];
}

export interface PositionedArchitectureNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PositionedArchitectureEdge {
  id: string;
  source: string;
  target: string;
  points?: Array<{ x: number; y: number }>;
}

export interface ArchitectureLayout {
  width: number;
  height: number;
  nodes: PositionedArchitectureNode[];
  edges: PositionedArchitectureEdge[];
}

export interface ArchitectureOverviewConnection {
  id: string;
  sourceStageId: string;
  targetStageId: string;
  type: ArchitectureViewConnection["type"];
  label?: string;
}

export interface ArchitectureExplorerPayload {
  version: number;
  view: {
    id: string;
    title: string;
    description?: string;
  };
  nodes: ArchitectureNode[];
  presentation: ArchitecturePresentation;
  overviewConnections: ArchitectureOverviewConnection[];
  layouts: {
    overview: ArchitectureLayout;
    stages: Record<string, ArchitectureLayout>;
    traces: Record<string, ArchitectureLayout>;
  };
}
