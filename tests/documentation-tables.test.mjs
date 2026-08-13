import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  resolveTableCellTooltipText,
  shouldDismissTableTooltip,
  syncTableCellOverflowState,
} from "../src/lib/documentation/table-overflow.mjs";

class TableCellTarget {
  constructor({ clientWidth, scrollWidth, textContent = "", tooltipText } = {}) {
    this.clientWidth = clientWidth;
    this.scrollWidth = scrollWidth;
    this.textContent = textContent;
    this.dataset = {};
    this.attributes = new Map();
    this.tabIndex = -1;
    if (tooltipText !== undefined) this.dataset.dsTableTooltipText = tooltipText;
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  removeAttribute(name) {
    this.attributes.delete(name);
    if (name === "tabindex") this.tabIndex = -1;
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }
}

test("adds tooltip semantics only to cells that actually overflow", () => {
  const clipped = new TableCellTarget({ clientWidth: 120, scrollWidth: 180 });
  const fitting = new TableCellTarget({ clientWidth: 120, scrollWidth: 121 });

  assert.equal(syncTableCellOverflowState(clipped, "table-tooltip"), true);
  assert.equal(clipped.dataset.dsTableOverflowing, "true");
  assert.equal(clipped.tabIndex, 0);
  assert.equal(clipped.getAttribute("aria-describedby"), "table-tooltip");

  assert.equal(syncTableCellOverflowState(fitting, "table-tooltip"), false);
  assert.equal(fitting.dataset.dsTableOverflowing, "false");
  assert.equal(fitting.tabIndex, -1);
  assert.equal(fitting.getAttribute("aria-describedby"), null);
});

test("uses an explicit full value before falling back to rendered cell text", () => {
  const explicit = new TableCellTarget({
    clientWidth: 80,
    scrollWidth: 160,
    textContent: "Short",
    tooltipText: "Complete reference-table value",
  });
  const fallback = new TableCellTarget({
    clientWidth: 80,
    scrollWidth: 160,
    textContent: "  Complete rendered value  ",
  });

  assert.equal(resolveTableCellTooltipText(explicit), "Complete reference-table value");
  assert.equal(resolveTableCellTooltipText(fallback), "Complete rendered value");
});

test("dismisses the table tooltip only for Escape", () => {
  assert.equal(shouldDismissTableTooltip("Escape"), true);
  assert.equal(shouldDismissTableTooltip("Enter"), false);
  assert.equal(shouldDismissTableTooltip("Tab"), false);
});

test("keeps tables inside a bordered content-width scrollport", async () => {
  const [frame, cell, typographySample] = await Promise.all([
    readFile(fileURLToPath(new URL("../src/components/_internal/documentation/DsTableFrame.astro", import.meta.url)), "utf8"),
    readFile(fileURLToPath(new URL("../src/components/_internal/documentation/DsTableCell.astro", import.meta.url)), "utf8"),
    readFile(fileURLToPath(new URL("../src/components/_internal/documentation/DsTypographyFoundationBlock.astro", import.meta.url)), "utf8"),
  ]);

  assert.match(frame, /max-width:\s*100%/u);
  assert.match(frame, /overflow-x:\s*auto/u);
  assert.match(frame, /border:\s*var\(--border-width-default\) solid var\(--color-border-subtle\)/u);
  assert.match(frame, /activateAnchoredOverlay/u);
  assert.match(frame, /popover", "manual/u);
  assert.doesNotMatch(frame, /inlineEndBleed|50cqw/u);

  assert.match(cell, /overflow\?: "ellipsis" \| "visual"/u);
  assert.match(cell, /text-overflow:\s*ellipsis/u);
  assert.match(cell, /white-space:\s*nowrap/u);
  assert.match(typographySample, /tooltipText=\{row\.sample \?\? "Ag"\}/u);
  assert.match(typographySample, /white-space:\s*nowrap !important/u);
  assert.doesNotMatch(typographySample, /overflow="visual"/u);
});
