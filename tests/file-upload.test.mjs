import test from "node:test";
import assert from "node:assert/strict";
import {
  formatByteCount,
  getFileExtension,
  getFileFormatLabel,
  matchesAcceptedFile,
  normalizeProgress,
  resolveProgress,
  validateFileSelection,
} from "../src/lib/file-upload/fileUploadModel.mjs";

const file = (name, type, size = 1) => ({ name, type, size });

test("accept supports MIME values, MIME wildcards and extension rules", () => {
  assert.equal(matchesAcceptedFile(file("photo.png", "image/png"), "image/*"), true);
  assert.equal(matchesAcceptedFile(file("notes.PDF", ""), ".pdf"), true);
  assert.equal(matchesAcceptedFile(file("data.json", "application/json"), "application/json"), true);
  assert.equal(matchesAcceptedFile(file("script.js", "text/javascript"), "image/*,.pdf"), false);
});

test("validation reports type, size and single-file count rejections", () => {
  const tooLarge = file("large.pdf", "application/pdf", 2_048);
  const wrongType = file("photo.png", "image/png", 100);
  const extra = file("extra.pdf", "application/pdf", 100);
  const result = validateFileSelection([tooLarge, wrongType, extra], {
    accept: ".pdf",
    maxFileSizeBytes: 1_024,
    multiple: false,
  });

  assert.deepEqual(result.accepted, []);
  assert.deepEqual(result.rejections.map(({ reason }) => reason), ["size", "count", "count"]);
});

test("multiple selection keeps accepted files when another file is rejected", () => {
  const accepted = file("brief.pdf", "application/pdf", 400);
  const rejected = file("photo.png", "image/png", 400);
  const result = validateFileSelection([accepted, rejected], { accept: ".pdf", multiple: true });

  assert.deepEqual(result.accepted, [accepted]);
  assert.deepEqual(result.rejections, [{ file: rejected, reason: "type" }]);
});

test("file labels safely handle names without extensions and multiple dots", () => {
  assert.equal(getFileExtension("README"), "");
  assert.equal(getFileFormatLabel("README"), "FILE");
  assert.equal(getFileExtension("archive.release.tar.gz"), "gz");
  assert.equal(getFileFormatLabel("archive.release.tar.gz"), "GZ");
});

test("byte formatting is readable and deterministic", () => {
  assert.equal(formatByteCount(0), "0 B");
  assert.equal(formatByteCount(1_024), "1.0 KB");
  assert.equal(formatByteCount(10 * 1_024), "10 KB");
  assert.equal(formatByteCount(1_048_576), "1.0 MB");
});

test("invalid and missing progress stay indeterminate", () => {
  assert.equal(normalizeProgress(undefined), undefined);
  assert.equal(normalizeProgress(-1), undefined);
  assert.equal(normalizeProgress(101), undefined);
  assert.equal(normalizeProgress(Number.NaN), undefined);
  assert.equal(resolveProgress({}), undefined);
  assert.equal(resolveProgress({ loadedBytes: 10, totalBytes: 0 }), undefined);
  assert.equal(resolveProgress({ loadedBytes: 25, totalBytes: 100 }), 25);
  assert.equal(resolveProgress({ progress: 70, loadedBytes: 25, totalBytes: 100 }), 70);
});
