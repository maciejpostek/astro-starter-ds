import ELK from "elkjs/lib/elk.bundled.js";
import type {
  ElkExtendedEdge,
  ElkNode
} from "elkjs/lib/elk-api";
import type {
  ArchitectureExplorerPayload,
  ArchitectureLayout,
  ArchitectureNodeInstance,
  ArchitectureViewConnection
} from "./types";

const elk = new ELK();

const layoutGraph = async (
  nodeIds: string[],
  connections: Array<{
    id: string;
    source: string;
    target: string;
  }>,
  dimensions: { width: number; height: number },
  direction: "RIGHT" | "DOWN" = "RIGHT"
): Promise<ArchitectureLayout> => {
  const graphDefinition: ElkNode = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": direction,
      "elk.edgeRouting": "ORTHOGONAL",
      "elk.spacing.nodeNode": "56",
      "elk.layered.spacing.nodeNodeBetweenLayers": "112",
      "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
      "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
      "elk.padding": "[top=48,left=48,bottom=48,right=48]"
    },
    children: nodeIds.map((id) => ({
      id,
      width: dimensions.width,
      height: dimensions.height
    })),
    edges: connections.map((connection) => ({
      id: connection.id,
      sources: [connection.source],
      targets: [connection.target]
    }))
  };
  const graph = await elk.layout(graphDefinition);

  return {
    width: graph.width ?? 0,
    height: graph.height ?? 0,
    nodes: (graph.children ?? []).map((node) => ({
      id: node.id,
      x: node.x ?? 0,
      y: node.y ?? 0,
      width: node.width ?? dimensions.width,
      height: node.height ?? dimensions.height
    })),
    edges: (graph.edges ?? []).map((edge: ElkExtendedEdge) => ({
      id: edge.id,
      source: edge.sources[0],
      target: edge.targets[0],
      points: edge.sections?.flatMap((section) => [
        section.startPoint,
        ...(section.bendPoints ?? []),
        section.endPoint
      ])
    }))
  };
};

const selectInternalConnections = (
  instanceIds: Set<string>,
  connections: ArchitectureViewConnection[]
) =>
  connections
    .filter(
      (connection) =>
        instanceIds.has(connection.sourceInstanceId) &&
        instanceIds.has(connection.targetInstanceId)
    )
    .map((connection) => ({
      id: connection.id,
      source: connection.sourceInstanceId,
      target: connection.targetInstanceId
    }));

const sortInstances = (instances: ArchitectureNodeInstance[]) =>
  [...instances].sort((a, b) => a.order - b.order);

const layoutOverview = async (
  projection: Omit<ArchitectureExplorerPayload, "layouts">
): Promise<ArchitectureLayout> => {
  const coreStages = projection.presentation.stages.filter(
    (stage) => stage.kind === "core"
  );
  const auxiliaryStages = projection.presentation.stages.filter(
    (stage) => stage.kind !== "core"
  );
  const width = 288;
  const height = 152;
  const auxiliaryGap = 72;
  const coreStageIds = new Set(coreStages.map((stage) => stage.id));
  const coreLayout = await layoutGraph(
    coreStages.map((stage) => stage.id),
    projection.overviewConnections
      .filter(
        (connection) =>
          coreStageIds.has(connection.sourceStageId) &&
          coreStageIds.has(connection.targetStageId) &&
          connection.type === "primary"
      )
      .map((connection) => ({
        id: connection.id,
        source: connection.sourceStageId,
        target: connection.targetStageId
      })),
    { width, height }
  );
  const auxiliaryRowWidth =
    auxiliaryStages.length * width +
    Math.max(0, auxiliaryStages.length - 1) * auxiliaryGap;
  const canvasWidth = Math.max(coreLayout.width, auxiliaryRowWidth + 96);
  const coreOffsetX = (canvasWidth - coreLayout.width) / 2;
  const auxiliaryStartX = (canvasWidth - auxiliaryRowWidth) / 2;
  const coreNodes = coreLayout.nodes.map((stage) => ({
    ...stage,
    x: stage.x + coreOffsetX
  }));
  const auxiliaryRowY = coreLayout.height + 104;
  const auxiliaryNodes = auxiliaryStages.map((stage, index) => ({
    id: stage.id,
    x: auxiliaryStartX + index * (width + auxiliaryGap),
    y: auxiliaryRowY,
    width,
    height
  }));

  return {
    width: canvasWidth,
    height: auxiliaryRowY + height + 48,
    nodes: [...coreNodes, ...auxiliaryNodes],
    edges: projection.overviewConnections.map((connection) => ({
      id: connection.id,
      source: connection.sourceStageId,
      target: connection.targetStageId
    }))
  };
};

const layoutGrid = (
  ordered: ArchitectureNodeInstance[],
  connections: ArchitectureViewConnection[]
): ArchitectureLayout => {
  const width = 304;
  const height = 180;
  const columnGap = 96;
  const rowGap = 88;
  const columns = Math.min(3, ordered.length);
  const rowWidth =
    columns * width + Math.max(0, columns - 1) * columnGap + 96;
  const nodes = ordered.map((instance, index) => {
    const row = Math.floor(index / 3);
    const indexInRow = index % 3;
    const itemsInRow = Math.min(3, ordered.length - row * 3);
    const column =
      row % 2 === 0 ? indexInRow : itemsInRow - 1 - indexInRow;
    const rowOffset =
      row > 0 && itemsInRow < 3
        ? (3 - itemsInRow) * (width + columnGap)
        : 0;

    return {
      id: instance.id,
      x: 48 + rowOffset + column * (width + columnGap),
      y: 48 + row * (height + rowGap),
      width,
      height
    };
  });
  const rowCount = Math.ceil(ordered.length / 3);
  const instanceIds = new Set(ordered.map((instance) => instance.id));

  return {
    width: Math.max(rowWidth, 48 + 3 * width + 2 * columnGap + 48),
    height: 48 + rowCount * height + Math.max(0, rowCount - 1) * rowGap + 48,
    nodes,
    edges: selectInternalConnections(instanceIds, connections)
  };
};

const layoutStage = (
  instances: ArchitectureNodeInstance[],
  connections: ArchitectureViewConnection[]
) => layoutGrid(sortInstances(instances), connections);

export const layoutArchitectureView = async (
  projection: Omit<ArchitectureExplorerPayload, "layouts">
): Promise<ArchitectureExplorerPayload> => {
  const overview = await layoutOverview(projection);

  const stageLayouts = Object.fromEntries(
    projection.presentation.stages.map((stage) => {
      const instances = projection.presentation.instances.filter(
        (instance) => instance.stageId === stage.id
      );
      return [
        stage.id,
        layoutStage(instances, projection.presentation.connections)
      ];
    })
  );

  const instanceById = new Map(
    projection.presentation.instances.map((instance) => [
      instance.id,
      instance
    ])
  );
  const traceLayouts = Object.fromEntries(
    projection.presentation.traces.map((trace) => {
      const instanceIdSet = new Set(trace.instanceIds);
      const connectionIdSet = new Set(trace.connectionIds);
      const instances = trace.instanceIds
        .map((instanceId) => instanceById.get(instanceId))
        .filter(
          (instance): instance is ArchitectureNodeInstance => Boolean(instance)
        );
      const connections = projection.presentation.connections.filter(
        (connection) =>
          connectionIdSet.has(connection.id) &&
          instanceIdSet.has(connection.sourceInstanceId) &&
          instanceIdSet.has(connection.targetInstanceId)
      );

      return [trace.id, layoutGrid(instances, connections)];
    })
  );

  return {
    ...projection,
    layouts: {
      overview,
      stages: stageLayouts,
      traces: traceLayouts
    }
  };
};
