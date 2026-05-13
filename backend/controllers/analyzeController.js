/**
 * Analyze Controller
 * Blocking JSON + streaming SSE endpoints.
 */

const { generateAnalysis, generateAnalysisStream } = require('../services/ollamaService');
const { initDB } = require('../config/db');

const analyzeTranscript = async (req, res) => {
  const { transcript } = req.body;

  if (!transcript || transcript.trim() === '') {
    return res.status(400).json({ error: 'Transcript text cannot be empty.' });
  }
  if (transcript.length > 50000) {
    return res.status(400).json({ error: 'Transcript is too long. Maximum 50,000 characters allowed.' });
  }

  try {
    console.log('[CONTROLLER] Analysis request');
    const result = await generateAnalysis(transcript);
    await _storeResult('anonymous', transcript, result);
    res.json(result);
  } catch (error) {
    console.error('[CONTROLLER ERROR]', error.message);
    res.status(500).json({ error: error.message || 'Analysis failed. Please try again.' });
  }
};

const analyzeTranscriptStream = async (req, res) => {
  const { transcript } = req.body;

  if (!transcript || transcript.trim() === '') {
    return res.status(400).json({ error: 'Transcript text cannot be empty.' });
  }
  if (transcript.length > 50000) {
    return res.status(400).json({ error: 'Transcript is too long. Maximum 50,000 characters allowed.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const send = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    if (typeof res.flush === 'function') res.flush();
  };

  try {
    console.log('[STREAM CONTROLLER] Analysis stream');
    send({ type: 'start' });

    const result = await generateAnalysisStream(transcript, (chunk) => {
      send({ type: 'chunk', text: chunk });
    });

    await _storeResult('anonymous', transcript, result);
    send({ type: 'done', result });
  } catch (error) {
    console.error('[STREAM CONTROLLER ERROR]', error.message);
    send({ type: 'error', message: error.message || 'Analysis failed.' });
  }

  res.end();
};

async function _storeResult(userId, transcript, result) {
  const db = await initDB();
  db.data.analyses.push({
    id: Date.now().toString(),
    userId,
    timestamp: new Date().toISOString(),
    transcript: transcript.substring(0, 500),
    result,
  });
  await db.write();
}

module.exports = { analyzeTranscript, analyzeTranscriptStream };
