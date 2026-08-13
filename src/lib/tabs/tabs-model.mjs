const ITEM_ID_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*$/u;
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

export const normalizeTabsState = (items, initialTab) => {
  assertNonEmptyTuple(items, "Tabs");

  const ids = new Set();
  const normalizedItems = items.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new TypeError(`Tabs item ${index + 1} must be an object.`);
    }

    const id = typeof item.id === "string" ? item.id.trim() : "";
    if (!ITEM_ID_PATTERN.test(id)) {
      throw new TypeError(
        `Tabs item ${index + 1} id must start with a letter and contain only letters, numbers, hyphens or underscores.`,
      );
    }
    if (ids.has(id)) throw new TypeError(`Tabs item id "${id}" must be unique.`);
    ids.add(id);

    return {
      id,
      label: normalizeLabel(item.label, "Tabs", index),
      disabled: item.disabled === true,
    };
  });

  const firstActiveItem = normalizedItems.find((item) => !item.disabled);
  if (!firstActiveItem) {
    throw new RangeError("Tabs must contain at least one enabled item.");
  }

  let activeId = firstActiveItem.id;
  if (initialTab !== undefined) {
    if (typeof initialTab !== "string" || initialTab.trim().length === 0) {
      throw new TypeError("Tabs initialTab must be a non-empty item id when provided.");
    }

    const initialItem = normalizedItems.find((item) => item.id === initialTab);
    if (!initialItem) throw new RangeError(`Tabs initialTab "${initialTab}" is unknown.`);
    if (initialItem.disabled) {
      throw new RangeError(`Tabs initialTab "${initialTab}" cannot reference a disabled item.`);
    }
    activeId = initialItem.id;
  }

  return { items: normalizedItems, activeId };
};

export const getNextTabId = (items, currentId, direction) => {
  const enabledItems = items.filter((item) => !item.disabled);
  if (enabledItems.length === 0) return undefined;
  if (direction === "first") return enabledItems[0].id;
  if (direction === "last") return enabledItems.at(-1).id;

  const currentIndex = enabledItems.findIndex((item) => item.id === currentId);
  const safeIndex = currentIndex < 0 ? 0 : currentIndex;
  const delta = direction === "previous" ? -1 : 1;
  return enabledItems[(safeIndex + delta + enabledItems.length) % enabledItems.length].id;
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
