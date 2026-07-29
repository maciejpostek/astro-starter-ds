import type {
  ArchitectureExplorerPayload,
  ArchitectureOverviewConnection,
  ArchitectureSystemMap,
  ArchitectureViewConnection
} from "./types";

const connectionPriority: Record<ArchitectureViewConnection["type"], number> = {
  repair: 6,
  feedback: 5,
  optional: 4,
  conditional: 3,
  context: 2,
  primary: 1
};

export const projectArchitectureView = (
  model: ArchitectureSystemMap,
  viewId: string
): Omit<ArchitectureExplorerPayload, "layouts"> => {
  const view = model.views.find((candidate) => candidate.id === viewId);
  if (!view?.presentation) {
    throw new Error(`Architecture view ${viewId} has no presentation model.`);
  }

  const nodeById = new Map(model.nodes.map((node) => [node.id, node]));
  const instanceById = new Map(
    view.presentation.instances.map((instance) => [instance.id, instance])
  );
  const stageByInstanceId = new Map(
    view.presentation.instances.map((instance) => [
      instance.id,
      instance.stageId
    ])
  );

  const selectedNodeIds = new Set(
    view.presentation.instances.map((instance) => instance.nodeId)
  );
  const nodes = [...selectedNodeIds].map((nodeId) => {
    const node = nodeById.get(nodeId);
    if (!node) {
      throw new Error(`Presentation instance references unknown node ${nodeId}.`);
    }
    return node;
  });

  const overviewConnectionByPair = new Map<
    string,
    ArchitectureOverviewConnection
  >();

  for (const connection of view.presentation.connections) {
    if (
      !instanceById.has(connection.sourceInstanceId) ||
      !instanceById.has(connection.targetInstanceId)
    ) {
      continue;
    }

    const sourceStageId = stageByInstanceId.get(connection.sourceInstanceId);
    const targetStageId = stageByInstanceId.get(connection.targetInstanceId);
    if (!sourceStageId || !targetStageId || sourceStageId === targetStageId) {
      continue;
    }

    const pairKey = `${sourceStageId}::${targetStageId}`;
    const existing = overviewConnectionByPair.get(pairKey);
    if (
      existing &&
      connectionPriority[existing.type] >= connectionPriority[connection.type]
    ) {
      continue;
    }

    overviewConnectionByPair.set(pairKey, {
      id: `overview.${sourceStageId}.${targetStageId}`,
      sourceStageId,
      targetStageId,
      type: connection.type,
      label: connection.label
    });
  }

  return {
    version: 1,
    view: {
      id: view.id,
      title: view.title,
      description: view.description
    },
    nodes,
    presentation: view.presentation,
    overviewConnections: [...overviewConnectionByPair.values()]
  };
};
