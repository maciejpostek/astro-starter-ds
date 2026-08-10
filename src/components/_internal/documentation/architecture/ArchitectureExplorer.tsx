import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeProps,
  type ReactFlowInstance
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import MaterialSymbol from "../../../assets/icons/MaterialSymbol";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import type {
  ArchitectureExplorerPayload,
  ArchitectureNode,
  ArchitectureNodeInstance,
  ArchitectureStage,
  ArchitectureViewConnection
} from "../../../../lib/architecture/types";
import "./ArchitectureExplorer.css";

type ExplorerMode =
  | { kind: "overview" }
  | { kind: "stage"; id: string }
  | { kind: "trace"; id: string };

interface ArchitectureExplorerProps {
  dataUrl: string;
  fallbackSvgUrl: string;
}

interface ExplorerNodeData extends Record<string, unknown> {
  kind: "stage" | "instance";
  stage?: ArchitectureStage;
  instance?: ArchitectureNodeInstance;
  architectureNode?: ArchitectureNode;
  matched?: boolean;
}

const typeLabels: Record<string, string> = {
  actor: "Actor",
  artifact: "Artifact",
  component: "Component",
  "decision-gate": "Decision gate",
  "external-system": "External system",
  foundation: "Foundation",
  "human-approval": "Human approval",
  input: "Input",
  output: "Output",
  process: "Process",
  prompt: "Prompt",
  router: "Router",
  "source-of-truth": "Source of Truth",
  state: "State",
  validator: "Validator"
};

const edgeColors: Record<ArchitectureViewConnection["type"], string> = {
  primary: "var(--architecture-edge-primary)",
  conditional: "var(--architecture-edge-conditional)",
  context: "var(--architecture-edge-context)",
  repair: "var(--architecture-edge-repair)",
  optional: "var(--architecture-edge-optional)",
  feedback: "var(--architecture-edge-feedback)"
};

const edgeDash: Partial<
  Record<ArchitectureViewConnection["type"], string>
> = {
  conditional: "8 7",
  context: "2 7",
  optional: "8 7",
  feedback: "3 6"
};

const ArchitectureCard = ({ data, selected }: NodeProps<Node<ExplorerNodeData>>) => {
  if (data.kind === "stage" && data.stage) {
    const stage = data.stage;
    return (
      <article
        className="architecture-node architecture-node--stage"
        data-stage-kind={stage.kind}
        data-matched={data.matched || undefined}
      >
        <Handle type="target" position={Position.Left} />
        <div className="architecture-node__eyebrow">
          <span>{stage.number}</span>
          <span>{stage.kind}</span>
        </div>
        <h3 className="heading-h5">{stage.title}</h3>
        <p className="body-small-regular">{stage.description}</p>
        <span className="architecture-node__action">
          Open {stage.instanceIds.length} steps
          <MaterialSymbol name="open_in_full" size={14} />
        </span>
        <Handle type="source" position={Position.Right} />
      </article>
    );
  }

  const instance = data.instance;
  const node = data.architectureNode;
  if (!instance || !node) return null;

  return (
    <article
      className="architecture-node architecture-node--instance"
      data-node-type={node.type}
      data-selected={selected || undefined}
      data-matched={data.matched || undefined}
    >
      <Handle type="target" position={Position.Left} />
      <div className="architecture-node__eyebrow">
        <span>{instance.stepNumber}</span>
        <span>{typeLabels[node.type] ?? node.type}</span>
      </div>
      <h3 className="heading-h5">{instance.title ?? node.title}</h3>
      <p className="body-small-regular">{instance.summary}</p>
      <div className="architecture-node__meta">
        <span data-status={node.status}>{node.status}</span>
        <span>{node.ownership.contextCost} context</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </article>
  );
};

const nodeTypes = { architectureCard: ArchitectureCard };

const createEdge = (
  id: string,
  source: string,
  target: string,
  type: ArchitectureViewConnection["type"],
  label?: string,
  dimmed = false
): Edge => ({
  id,
  source,
  target,
  label,
  type: "smoothstep",
  animated: type === "feedback" && !dimmed,
  focusable: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: edgeColors[type],
    width: 17,
    height: 17
  },
  style: {
    stroke: edgeColors[type],
    strokeDasharray: edgeDash[type],
    strokeWidth: type === "repair" ? 2.5 : 1.75,
    opacity: dimmed ? 0.12 : 0.9
  },
  labelStyle: {
    fill: "var(--color-text-secondary)",
    fontSize: 11,
    fontWeight: 600
  },
  labelBgStyle: {
    fill: "var(--color-background-surface)",
    fillOpacity: 0.96
  },
  labelBgPadding: [6, 4],
  labelBgBorderRadius: 4
});

const modeLabel = (
  mode: ExplorerMode,
  payload: ArchitectureExplorerPayload
) => {
  if (mode.kind === "overview") return "Overview · operational V1.0 runtime";
  if (mode.kind === "stage") {
    const stage = payload.presentation.stages.find(
      (candidate) => candidate.id === mode.id
    );
    return stage ? `${stage.number} · ${stage.title}` : "Stage";
  }
  return (
    payload.presentation.traces.find((trace) => trace.id === mode.id)?.title ??
    "Trace"
  );
};

const ExplorerCanvas = ({
  dataUrl,
  fallbackSvgUrl
}: ArchitectureExplorerProps) => {
  const [payload, setPayload] = useState<ArchitectureExplorerPayload | null>(
    null
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mode, setMode] = useState<ExplorerMode>({ kind: "overview" });
  const [query, setQuery] = useState("");
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    null
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [flowInstance, setFlowInstance] =
    useState<ReactFlowInstance<Node<ExplorerNodeData>, Edge> | null>(null);
  const explorerRef = useRef<HTMLDivElement>(null);
  const fullscreenButtonRef = useRef<HTMLButtonElement>(null);
  const hasRestoredUrl = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(dataUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Architecture data returned ${response.status}.`);
        }
        return response.json() as Promise<ArchitectureExplorerPayload>;
      })
      .then((data) => setPayload(data))
      .catch((error: Error) => {
        if (error.name !== "AbortError") setLoadError(error.message);
      });

    return () => controller.abort();
  }, [dataUrl]);

  useEffect(() => {
    if (!payload || hasRestoredUrl.current) return;
    hasRestoredUrl.current = true;
    const params = new URLSearchParams(window.location.search);
    const traceId = params.get("trace");
    const stageNumber = params.get("stage");
    const nodeId = params.get("node");

    if (
      traceId &&
      payload.presentation.traces.some((trace) => trace.id === traceId)
    ) {
      setMode({ kind: "trace", id: traceId });
    } else if (stageNumber) {
      const stage = payload.presentation.stages.find(
        (candidate) =>
          candidate.number === stageNumber || candidate.id === stageNumber
      );
      if (stage) setMode({ kind: "stage", id: stage.id });
    }

    if (
      nodeId &&
      payload.presentation.instances.some(
        (instance) => instance.id === nodeId
      )
    ) {
      setSelectedInstanceId(nodeId);
    }
  }, [payload]);

  const updateUrl = useCallback(
    (nextMode: ExplorerMode, nodeId?: string | null) => {
      const url = new URL(window.location.href);
      url.searchParams.delete("stage");
      url.searchParams.delete("trace");
      url.searchParams.delete("node");
      if (nextMode.kind === "stage") {
        const stage = payload?.presentation.stages.find(
          (candidate) => candidate.id === nextMode.id
        );
        if (stage) url.searchParams.set("stage", stage.number);
      }
      if (nextMode.kind === "trace") {
        url.searchParams.set("trace", nextMode.id);
      }
      if (nodeId) url.searchParams.set("node", nodeId);
      window.history.replaceState({}, "", url);
    },
    [payload]
  );

  const selectMode = useCallback(
    (nextMode: ExplorerMode) => {
      setMode(nextMode);
      setSelectedInstanceId(null);
      updateUrl(nextMode, null);
      requestAnimationFrame(() => flowInstance?.fitView({ padding: 0.18 }));
    },
    [flowInstance, updateUrl]
  );

  const nodeById = useMemo(
    () => new Map(payload?.nodes.map((node) => [node.id, node]) ?? []),
    [payload]
  );
  const instanceById = useMemo(
    () =>
      new Map(
        payload?.presentation.instances.map((instance) => [
          instance.id,
          instance
        ]) ?? []
      ),
    [payload]
  );

  const searchMatchIds = useMemo(() => {
    if (!payload || !query.trim()) return new Set<string>();
    const normalized = query.trim().toLowerCase();
    return new Set(
      payload.presentation.instances
        .filter((instance) => {
          const node = nodeById.get(instance.nodeId);
          return [
            instance.id,
            instance.stepNumber,
            instance.title,
            instance.summary,
            instance.purpose,
            node?.id,
            node?.title,
            node?.type,
            node?.sourcePaths.join(" ")
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(normalized);
        })
        .map((instance) => instance.id)
    );
  }, [instanceById, nodeById, payload, query]);

  const graph = useMemo(() => {
    if (!payload) return { nodes: [] as Node<ExplorerNodeData>[], edges: [] as Edge[] };

    if (mode.kind === "overview") {
      const positionById = new Map(
        payload.layouts.overview.nodes.map((node) => [node.id, node])
      );
      const stagesWithMatches = new Set(
        payload.presentation.instances
          .filter((instance) => searchMatchIds.has(instance.id))
          .map((instance) => instance.stageId)
      );
      const hasQuery = Boolean(query.trim());

      return {
        nodes: payload.presentation.stages.map((stage) => {
          const position = positionById.get(stage.id);
          const matched = stagesWithMatches.has(stage.id);
          return {
            id: stage.id,
            type: "architectureCard",
            position: { x: position?.x ?? 0, y: position?.y ?? 0 },
            data: { kind: "stage", stage, matched },
            width: position?.width ?? 288,
            height: position?.height ?? 152,
            draggable: false,
            selectable: true,
            focusable: true,
            style: {
              width: position?.width ?? 288,
              height: position?.height ?? 152,
              opacity: hasQuery && !matched ? 0.2 : 1
            }
          } satisfies Node<ExplorerNodeData>;
        }),
        edges: payload.overviewConnections.map((connection) =>
          createEdge(
            connection.id,
            connection.sourceStageId,
            connection.targetStageId,
            connection.type,
            connection.label,
            false
          )
        )
      };
    }

    const layout =
      mode.kind === "stage"
        ? payload.layouts.stages[mode.id]
        : payload.layouts.traces[mode.id];
    const selectedIds =
      mode.kind === "stage"
        ? new Set(
            payload.presentation.stages.find((stage) => stage.id === mode.id)
              ?.instanceIds ?? []
          )
        : new Set(
            payload.presentation.traces.find((trace) => trace.id === mode.id)
              ?.instanceIds ?? []
          );
    const selectedConnectionIds =
      mode.kind === "trace"
        ? new Set(
            payload.presentation.traces.find((trace) => trace.id === mode.id)
              ?.connectionIds ?? []
          )
        : null;
    const positionById = new Map(
      (layout?.nodes ?? []).map((node) => [node.id, node])
    );
    const hasQuery = Boolean(query.trim());

    const nodes = payload.presentation.instances
      .filter((instance) => selectedIds.has(instance.id))
      .map((instance) => {
        const position = positionById.get(instance.id);
        const matched = searchMatchIds.has(instance.id);
        return {
          id: instance.id,
          type: "architectureCard",
          position: { x: position?.x ?? 0, y: position?.y ?? 0 },
          data: {
            kind: "instance",
            instance,
            architectureNode: nodeById.get(instance.nodeId),
            matched
          },
          width: position?.width ?? 304,
          height: position?.height ?? 180,
          selected: selectedInstanceId === instance.id,
          draggable: false,
          selectable: true,
          focusable: true,
          style: {
            width: position?.width ?? 304,
            height: position?.height ?? 180,
            opacity: hasQuery && !matched ? 0.16 : 1
          }
        } satisfies Node<ExplorerNodeData>;
      });

    const edges = payload.presentation.connections
      .filter(
        (connection) =>
          selectedIds.has(connection.sourceInstanceId) &&
          selectedIds.has(connection.targetInstanceId) &&
          (!selectedConnectionIds || selectedConnectionIds.has(connection.id))
      )
      .map((connection) =>
        createEdge(
          connection.id,
          connection.sourceInstanceId,
          connection.targetInstanceId,
          connection.type,
          connection.label ?? connection.condition,
          hasQuery &&
            !searchMatchIds.has(connection.sourceInstanceId) &&
            !searchMatchIds.has(connection.targetInstanceId)
        )
      );

    return { nodes, edges };
  }, [
    mode,
    nodeById,
    payload,
    query,
    searchMatchIds,
    selectedInstanceId
  ]);

  useEffect(() => {
    if (!flowInstance || !payload) return;
    const timeout = window.setTimeout(
      () => flowInstance.fitView({ padding: 0.18, duration: 240 }),
      120
    );
    return () => window.clearTimeout(timeout);
  }, [flowInstance, graph.nodes.length, mode, payload]);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
        requestAnimationFrame(() => fullscreenButtonRef.current?.focus());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const selectedInstance = selectedInstanceId
    ? instanceById.get(selectedInstanceId)
    : undefined;
  const selectedNode = selectedInstance
    ? nodeById.get(selectedInstance.nodeId)
    : undefined;
  const incoming = payload?.presentation.connections.filter(
    (connection) => connection.targetInstanceId === selectedInstanceId
  );
  const outgoing = payload?.presentation.connections.filter(
    (connection) => connection.sourceInstanceId === selectedInstanceId
  );

  const copyText = async (text: string, feedback: string) => {
    await navigator.clipboard.writeText(text);
    setCopyFeedback(feedback);
    window.setTimeout(() => setCopyFeedback(null), 1800);
  };

  const openSearchResult = (instance: ArchitectureNodeInstance) => {
    setMode({ kind: "stage", id: instance.stageId });
    setSelectedInstanceId(instance.id);
    updateUrl({ kind: "stage", id: instance.stageId }, instance.id);
  };

  if (loadError) {
    return (
      <div className="architecture-explorer architecture-explorer--error">
        <p className="body-small-regular">Interactive architecture data could not be loaded: {loadError}</p>
        <a href={fallbackSvgUrl}>Open the static SVG fallback</a>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="architecture-explorer architecture-explorer--loading">
        <span aria-hidden="true" />
        Loading interactive architecture…
      </div>
    );
  }

  const trace = mode.kind === "trace"
    ? payload.presentation.traces.find((candidate) => candidate.id === mode.id)
    : undefined;

  return (
    <div
      ref={explorerRef}
      className="architecture-explorer"
      data-fullscreen={isFullscreen || undefined}
      role={isFullscreen ? "dialog" : undefined}
      aria-modal={isFullscreen || undefined}
      aria-label="AI-Native Design System V1.0 Runtime Explorer"
    >
      <header className="architecture-explorer__toolbar">
        <div className="architecture-explorer__view-controls">
          <button
            type="button"
            className="architecture-explorer__overview-button"
            data-active={mode.kind === "overview" || undefined}
            onClick={() => selectMode({ kind: "overview" })}
          >
            Overview
          </button>
          <label>
            <span className="architecture-explorer__sr-only">Select stage</span>
            <select
              value={mode.kind === "stage" ? mode.id : ""}
              onChange={(event) => {
                if (event.target.value) {
                  selectMode({ kind: "stage", id: event.target.value });
                }
              }}
            >
              <option value="">Runtime or conditional stage</option>
              {payload.presentation.stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.number} · {stage.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="architecture-explorer__sr-only">Select trace</span>
            <select
              value={mode.kind === "trace" ? mode.id : ""}
              onChange={(event) => {
                if (event.target.value) {
                  selectMode({ kind: "trace", id: event.target.value });
                }
              }}
            >
              <option value="">Trace preset</option>
              {payload.presentation.traces.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="architecture-explorer__actions">
          <label className="architecture-explorer__search">
            <MaterialSymbol name="search" size={16} />
            <span className="architecture-explorer__sr-only">
              Search architecture
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search names, files, IDs…"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <MaterialSymbol name="close" size={14} />
              </button>
            ) : null}
          </label>
          <button
            type="button"
            onClick={() => flowInstance?.zoomOut()}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <MaterialSymbol name="remove" size={16} />
          </button>
          <button
            type="button"
            onClick={() => flowInstance?.zoomIn()}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <MaterialSymbol name="add" size={16} />
          </button>
          <button
            type="button"
            onClick={() => flowInstance?.fitView({ padding: 0.18 })}
            aria-label="Fit view"
            title="Fit view"
          >
            <MaterialSymbol name="center_focus_strong" size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              selectMode({ kind: "overview" });
            }}
            aria-label="Reset explorer"
            title="Reset"
          >
            <MaterialSymbol name="refresh" size={16} />
          </button>
          <button
            type="button"
            onClick={() => copyText(window.location.href, "Link copied")}
            aria-label="Copy link to current architecture view"
            title="Copy link"
          >
            <MaterialSymbol name="link" size={16} />
          </button>
          <button
            ref={fullscreenButtonRef}
            type="button"
            onClick={() => setIsFullscreen((value) => !value)}
            aria-label={isFullscreen ? "Exit fullscreen" : "Open fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <MaterialSymbol name="close" size={16} />
            ) : (
              <MaterialSymbol name="open_in_full" size={16} />
            )}
          </button>
        </div>
      </header>

      <div className="architecture-explorer__context-bar">
        <strong>{modeLabel(mode, payload)}</strong>
        <span>
          {trace
            ? `${trace.contextCost} context cost · ${trace.description}`
            : mode.kind === "overview"
              ? "Select a stage to inspect its numbered sub-processes."
              : "Select a node to inspect its purpose, files, ownership, and relations."}
        </span>
        <a href={fallbackSvgUrl} target="_blank" rel="noreferrer">
          Static SVG
          <MaterialSymbol name="open_in_new" size={13} />
        </a>
      </div>

      {query && searchMatchIds.size > 0 ? (
        <div className="architecture-explorer__search-results">
          <span>{searchMatchIds.size} matches</span>
          <div>
            {payload.presentation.instances
              .filter((instance) => searchMatchIds.has(instance.id))
              .slice(0, 8)
              .map((instance) => (
                <button
                  key={instance.id}
                  type="button"
                  onClick={() => openSearchResult(instance)}
                >
                  {instance.stepNumber} ·{" "}
                  {instance.title ?? nodeById.get(instance.nodeId)?.title}
                </button>
              ))}
          </div>
        </div>
      ) : null}

      <div className="architecture-explorer__workspace">
        <div className="architecture-explorer__canvas">
          <ReactFlow<Node<ExplorerNodeData>, Edge>
            nodes={graph.nodes}
            edges={graph.edges}
            nodeTypes={nodeTypes}
            onInit={setFlowInstance}
            onNodeClick={(_, node) => {
              if (node.data.kind === "stage" && node.data.stage) {
                selectMode({ kind: "stage", id: node.data.stage.id });
                return;
              }
              if (node.data.instance) {
                setSelectedInstanceId(node.data.instance.id);
                updateUrl(mode, node.data.instance.id);
              }
            }}
            onPaneClick={() => {
              setSelectedInstanceId(null);
              updateUrl(mode, null);
            }}
            nodesDraggable={false}
            nodesConnectable={false}
            nodesFocusable
            edgesFocusable
            elementsSelectable
            panOnDrag
            zoomOnScroll
            zoomOnPinch
            minZoom={0.18}
            maxZoom={1.75}
            fitView
            fitViewOptions={{ padding: 0.18 }}
            proOptions={{ hideAttribution: false }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="var(--color-border-subtle)"
            />
            <Controls showZoom={false} showFitView={false} showInteractive={false} />
          </ReactFlow>
        </div>

        {selectedInstance && selectedNode ? (
          <aside
            className="architecture-explorer__details"
            aria-label={`Details for ${selectedInstance.title ?? selectedNode.title}`}
          >
            <div className="architecture-explorer__details-header">
              <div>
                <span>{selectedInstance.stepNumber}</span>
                <h3 className="heading-h5">{selectedInstance.title ?? selectedNode.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedInstanceId(null);
                  updateUrl(mode, null);
                }}
                aria-label="Close details"
              >
                <MaterialSymbol name="close" size={16} />
              </button>
            </div>

            <dl className="architecture-explorer__facts">
              <div>
                <dt>Type</dt>
                <dd>{typeLabels[selectedNode.type] ?? selectedNode.type}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{selectedNode.status}</dd>
              </div>
              <div>
                <dt>State</dt>
                <dd>{selectedNode.architectureState}</dd>
              </div>
              <div>
                <dt>Context</dt>
                <dd>{selectedNode.ownership.contextCost}</dd>
              </div>
            </dl>

            <section>
              <h4 className="heading-h6">Purpose</h4>
              <p className="body-small-regular">{selectedInstance.purpose}</p>
            </section>
            <section className="architecture-explorer__io">
              <div>
                <h4 className="heading-h6">Input</h4>
                <ul>
                  {selectedInstance.inputs.map((input) => (
                    <li key={input}>{input}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="heading-h6">Output</h4>
                <ul>
                  {selectedInstance.outputs.map((output) => (
                    <li key={output}>{output}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h4 className="heading-h6">Ownership</h4>
              <dl className="architecture-explorer__ownership">
                <div>
                  <dt>Owner</dt>
                  <dd>{selectedNode.ownership.owner}</dd>
                </div>
                <div>
                  <dt>Readers</dt>
                  <dd>{selectedNode.ownership.readers.join(", ") || "None"}</dd>
                </div>
                <div>
                  <dt>Writers</dt>
                  <dd>{selectedNode.ownership.writers.join(", ") || "None"}</dd>
                </div>
                <div>
                  <dt>Validators</dt>
                  <dd>
                    {selectedNode.ownership.validatorNodeIds.join(", ") ||
                      "None"}
                  </dd>
                </div>
              </dl>
            </section>

            <section>
              <h4 className="heading-h6">Files</h4>
              {selectedNode.sourcePaths.length ? (
                <ul className="architecture-explorer__paths">
                  {selectedNode.sourcePaths.map((path) => (
                    <li key={path}>
                      <code>{path}</code>
                      <button
                        type="button"
                        onClick={() => copyText(path, "Path copied")}
                        aria-label={`Copy ${path}`}
                      >
                        Copy
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="body-small-regular">No current source file; this mechanism is proposed.</p>
              )}
            </section>

            <section>
              <h4 className="heading-h6">Relations</h4>
              <ul>
                {(incoming ?? []).map((connection) => (
                  <li key={`in-${connection.id}`}>
                    ← {instanceById.get(connection.sourceInstanceId)?.stepNumber}{" "}
                    {connection.type}
                  </li>
                ))}
                {(outgoing ?? []).map((connection) => (
                  <li key={`out-${connection.id}`}>
                    → {instanceById.get(connection.targetInstanceId)?.stepNumber}{" "}
                    {connection.type}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        ) : null}
      </div>

      <div className="architecture-explorer__status" aria-live="polite">
        {copyFeedback}
      </div>
    </div>
  );
};

export default function ArchitectureExplorer(
  props: ArchitectureExplorerProps
) {
  return (
    <ReactFlowProvider>
      <ExplorerCanvas {...props} />
    </ReactFlowProvider>
  );
}
