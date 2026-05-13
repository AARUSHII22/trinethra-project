/**
 * Loads assignment artifacts from the repository root (rubric.json, context.md).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

function readRubric() {
  const p = path.join(ROOT, 'rubric.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function readContextMd() {
  const p = path.join(ROOT, 'context.md');
  return fs.readFileSync(p, 'utf8');
}

let _cache;
function getAssignmentPayload() {
  if (!_cache) {
    _cache = {
      rubric: readRubric(),
      contextMd: readContextMd(),
    };
  }
  return _cache;
}

module.exports = { getAssignmentPayload, ROOT };
