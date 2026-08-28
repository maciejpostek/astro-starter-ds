const HASH_PATTERN = /^#[A-Za-z][A-Za-z0-9_-]*$/u;

const assertNonEmptyTuple = (items, componentName) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new TypeError(`${componentName} items must be a non-empty array.`);
  }
};

const normalizeLabel = (label, componentName, index) => {
  if (typeof label !== "string" || label.trim().length === 0) {
    throw new TypeError(`${componentName} item ${index + 1} must have a non-empty label.`);
  }

  return label.trim();
};

export const validateTabMenuItems = (items) => {
  assertNonEmptyTuple(items, "TabMenu");

  const labels = new Set();
  const hashes = new Set();
  return items.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new TypeError(`TabMenu item ${index + 1} must be an object.`);
    }

    const label = normalizeLabel(item.label, "TabMenu", index);
    const href = typeof item.href === "string" ? item.href.trim() : "";
    if (!HASH_PATTERN.test(href)) {
      throw new TypeError(
        `TabMenu item ${index + 1} href must be a same-page hash that starts with a letter.`,
      );
    }
    if (labels.has(label)) throw new TypeError(`TabMenu label "${label}" must be unique.`);
    if (hashes.has(href)) throw new TypeError(`TabMenu href "${href}" must be unique.`);
    labels.add(label);
    hashes.add(href);

    return { label, href };
  });
};
