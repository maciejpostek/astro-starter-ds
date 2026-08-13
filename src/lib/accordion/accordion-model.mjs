const VALID_MODES = new Set(["single", "multiple"]);

/**
 * @typedef {{
 *   id: string,
 *   title: string,
 *   content: string,
 *   helpText?: string,
 *   helpLabel?: string,
 *   disabled?: boolean
 * }} AccordionItem
 */

const assertNonEmptyString = (value, field, index) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`Accordion item ${index + 1} requires a non-empty ${field}.`);
  }
};

export const normalizeAccordionState = (
  /** @type {readonly AccordionItem[]} */
  items,
  /** @type {"single" | "multiple"} */
  mode = "single",
  /** @type {"none" | "first" | readonly string[]} */
  initialOpen = "none",
) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new TypeError("Accordion requires at least one item.");
  }

  if (!VALID_MODES.has(mode)) {
    throw new TypeError('Accordion mode must be either "single" or "multiple".');
  }

  const ids = new Set();
  const disabledIds = new Set();

  items.forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new TypeError(`Accordion item ${index + 1} must be an object.`);
    }

    assertNonEmptyString(item.id, "id", index);
    assertNonEmptyString(item.title, "title", index);
    assertNonEmptyString(item.content, "content", index);

    if (ids.has(item.id)) {
      throw new TypeError(`Accordion item id "${item.id}" must be unique.`);
    }

    if (item.helpText !== undefined) {
      assertNonEmptyString(item.helpText, "helpText", index);
    }

    if (item.helpLabel !== undefined) {
      assertNonEmptyString(item.helpLabel, "helpLabel", index);
    }

    if (item.disabled !== undefined && typeof item.disabled !== "boolean") {
      throw new TypeError(`Accordion item ${index + 1} disabled must be a boolean.`);
    }

    ids.add(item.id);
    if (item.disabled) disabledIds.add(item.id);
  });

  let requestedIds;

  if (initialOpen === "none") {
    requestedIds = [];
  } else if (initialOpen === "first") {
    const firstActiveItem = items.find((item) => !item.disabled);
    requestedIds = firstActiveItem ? [firstActiveItem.id] : [];
  } else if (Array.isArray(initialOpen)) {
    requestedIds = [...initialOpen];
  } else {
    throw new TypeError(
      'Accordion initialOpen must be "none", "first", or an array of item IDs.',
    );
  }

  if (mode === "single" && requestedIds.length > 1) {
    throw new RangeError("Accordion single mode accepts at most one initially open item.");
  }

  const requestedSet = new Set();

  requestedIds.forEach((id) => {
    if (typeof id !== "string" || id.trim().length === 0) {
      throw new TypeError("Accordion initialOpen IDs must be non-empty strings.");
    }

    if (requestedSet.has(id)) {
      throw new TypeError(`Accordion initialOpen id "${id}" must be unique.`);
    }

    if (!ids.has(id)) {
      throw new RangeError(`Accordion initialOpen references unknown item id "${id}".`);
    }

    if (disabledIds.has(id)) {
      throw new RangeError(`Accordion cannot initially open disabled item "${id}".`);
    }

    requestedSet.add(id);
  });

  return {
    mode,
    openIds: requestedSet,
  };
};
