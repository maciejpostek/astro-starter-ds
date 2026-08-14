import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { normalizeValidationState } from "../src/lib/forms/validationState.ts";

test("canonical validation states pass through unchanged", () => {
  for (const state of ["none", "success", "warning", "error"]) {
    assert.equal(normalizeValidationState(state), state);
  }
});

test("legacy validation aliases normalize without changing the public compatibility contract", () => {
  assert.equal(normalizeValidationState("default"), "none");
  assert.equal(normalizeValidationState("valid"), "success");
  assert.equal(normalizeValidationState("invalid"), "error");
});

test("Input keeps status borders while focus wins the halo and Disabled removes it", () => {
  const source = readFileSync(new URL("../src/components/base-components/inputs/Input.astro", import.meta.url), "utf8");
  const errorIndex = source.indexOf('[data-input-validation="error"]');
  const focusIndex = source.indexOf(':focus-visible');
  const disabledIndex = source.indexOf(".input:disabled {");

  assert.ok(errorIndex >= 0 && focusIndex > errorIndex && disabledIndex > focusIndex);
  assert.match(source, /data-input-validation="error"[\s\S]*var\(--effect-validation-error\)/u);
  assert.match(source, /data-input-validation="warning"[\s\S]*var\(--effect-validation-warning\)/u);
  assert.match(source, /data-input-validation="success"[\s\S]*var\(--effect-validation-success\)/u);
  assert.match(source, /:focus-visible[\s\S]*box-shadow:\s*var\(--effect-focused\)/u);
  assert.match(source, /\.input:disabled\s*\{[^}]*box-shadow:\s*none;/u);
});

test("Error is the only canonical state that sets aria-invalid", () => {
  const input = readFileSync(new URL("../src/components/base-components/inputs/Input.astro", import.meta.url), "utf8");
  const select = readFileSync(new URL("../src/components/_internal/behaviors/SelectControl.astro", import.meta.url), "utf8");

  assert.match(input, /validationState === "error"\s*\? "true"\s*:\s*undefined/u);
  assert.match(select, /validationState === "error"\s*\? "true"\s*:\s*undefined/u);
  assert.doesNotMatch(input, /validationState === "(?:success|warning)"[\s\S]{0,40}"true"/u);
  assert.doesNotMatch(select, /validationState === "(?:success|warning)"[\s\S]{0,40}"true"/u);
});
