/**
 * Loads assignment artifacts from the repository root (rubric.json, context.txt).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

function readRubric() {
  const p = path.join(ROOT, 'rubric.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function readContextText() {
  const p = path.join(ROOT, 'context.txt');
  return fs.readFileSync(p, 'utf8');
}

let _cache;
function getAssignmentPayload() {
  if (!_cache) {
    _cache = {
      rubric: readRubric(),
      contextMd: readContextText(),
    };
  }
  return _cache;
}

module.exports = { getAssignmentPayload, ROOT };
