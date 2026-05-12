/**
 * Analyze Routes
 * Endpoint definitions for analysis.
 */

const express = require('express');
const { analyzeTranscript } = require('../controllers/analyzeController');

const router = express.Router();

// POST /api/analyze
router.post('/analyze', analyzeTranscript);

module.exports = router;
