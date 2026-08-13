const ACCEPT_SEPARATOR = /\s*,\s*/;

export const FILE_REJECTION_REASONS = ["type", "size", "count"];

export const getFileExtension = (fileName) => {
  const name = String(fileName ?? "").trim();
  const lastDot = name.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === name.length - 1) return "";
  return name.slice(lastDot + 1).toLowerCase();
};

export const getFileFormatLabel = (fileName) => {
  const extension = getFileExtension(fileName);
  return extension ? extension.toUpperCase() : "FILE";
};

export const matchesAcceptedFile = (file, accept = "") => {
  const rules = String(accept)
    .split(ACCEPT_SEPARATOR)
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);

  if (rules.length === 0) return true;

  const fileName = String(file?.name ?? "").toLowerCase();
  const mimeType = String(file?.type ?? "").toLowerCase();

  return rules.some((rule) => {
    if (rule.startsWith(".")) return fileName.endsWith(rule);
    if (rule.endsWith("/*")) return mimeType.startsWith(rule.slice(0, -1));
    return mimeType === rule;
  });
};

/** @param {Iterable<unknown> | ArrayLike<unknown>} files @param {any} options */
export const validateFileSelection = (
  files,
  { accept = "", multiple = false, maxFileSizeBytes } = {},
) => {
  const candidates = Array.from(files ?? []);
  const accepted = [];
  const rejections = [];

  candidates.forEach((file, index) => {
    if (!multiple && index > 0) {
      rejections.push({ file, reason: "count" });
      return;
    }
    if (!matchesAcceptedFile(file, accept)) {
      rejections.push({ file, reason: "type" });
      return;
    }
    if (
      Number.isFinite(maxFileSizeBytes)
      && maxFileSizeBytes >= 0
      && Number(file?.size ?? 0) > maxFileSizeBytes
    ) {
      rejections.push({ file, reason: "size" });
      return;
    }
    accepted.push(file);
  });

  return { accepted, rejections };
};

export const formatByteCount = (bytes) => {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const scaled = value / 1024 ** unitIndex;
  const digits = unitIndex === 0 || scaled >= 10 ? 0 : 1;
  return `${scaled.toFixed(digits)} ${units[unitIndex]}`;
};

export const normalizeProgress = (progress) => {
  if (progress === undefined || progress === null || progress === "") return undefined;
  const value = Number(progress);
  return Number.isFinite(value) && value >= 0 && value <= 100 ? value : undefined;
};

export const resolveProgress = ({ progress, loadedBytes, totalBytes } = {}) => {
  const explicit = normalizeProgress(progress);
  if (explicit !== undefined) return explicit;
  const loaded = Number(loadedBytes);
  const total = Number(totalBytes);
  if (!Number.isFinite(loaded) || !Number.isFinite(total) || total <= 0 || loaded < 0) return undefined;
  return Math.min(100, Math.max(0, (loaded / total) * 100));
};
