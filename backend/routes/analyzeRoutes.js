/**
 * Analyze routes — no authentication (assignment MVP).
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { analyzeTranscript, analyzeTranscriptStream } = require('../controllers/analyzeController');
const { ROOT } = require('../utils/assignmentData');

const router = express.Router();

router.get('/sample-transcripts', (req, res) => {
  try {
    const filePath = path.join(ROOT, 'sample-transcripts.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(data);
  } catch (e) {
    console.error('[sample-transcripts]', e.message);
    res.status(500).json({ error: 'Could not load sample-transcripts.json' });
  }
});

router.post('/analyze', analyzeTranscript);
router.post('/analyze/stream', analyzeTranscriptStream);

module.exports = router;
