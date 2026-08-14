export const resolveFigmaNodeHref = (fileUrl, nodeId) =>
  nodeId ? `${fileUrl}?node-id=${nodeId.replace(":", "-")}` : undefined;
