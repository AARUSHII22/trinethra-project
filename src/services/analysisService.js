/**
 * Analysis Service
 * analyzeTranscript     — blocking POST (fallback)
 * analyzeTranscriptStream — streaming SSE (primary, real-time feedback)
 */

import { post } from './api';

// ── Blocking (fallback) ──────────────────────────────────────────────────────
export const analyzeTranscript = async (transcript) => {
  try {
    return await post('/analyze', { transcript });
  } catch (error) {
    console.error('[ANALYSIS SERVICE ERROR]', error.message);
    throw error;
  }
};

// ── Streaming SSE ────────────────────────────────────────────────────────────
// onChunk(text) is called for every token Ollama streams back.
// Returns the fully-parsed analysis result object.
export const analyzeTranscriptStream = async (transcript, onChunk) => {
  const response = await fetch('/api/analyze/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finalResult = null;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';

      for (const event of events) {
        const trimmed = event.trim();
        if (!trimmed.startsWith('data: ')) continue;
        let data;
        try {
          data = JSON.parse(trimmed.slice(6));
        } catch {
          continue; // malformed SSE line — skip
        }
        if (data.type === 'chunk' && onChunk) {
          onChunk(data.text);
        } else if (data.type === 'done') {
          finalResult = data.result;
        } else if (data.type === 'error') {
          throw new Error(data.message || 'Analysis failed');
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (!finalResult) {
    throw new Error('Analysis completed but no result was returned. Check Ollama logs.');
  }

  return finalResult;
};
