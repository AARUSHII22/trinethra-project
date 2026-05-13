/**
 * Analysis service — blocking POST to /api/analyze (reliable with long Ollama runs).
 * Optional SSE helper kept for experiments; the UI uses blocking only.
 */

import { post } from './api';

export const analyzeTranscript = async (transcript) => {
  try {
    return await post('/analyze', { transcript }, { timeoutMs: 600_000 });
  } catch (error) {
    console.error('[ANALYSIS SERVICE ERROR]', error.message);
    throw error;
  }
};

/** @deprecated Prefer analyzeTranscript — SSE can stall behind proxies. */
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

  const handleEventLine = (eventBlock) => {
    const trimmed = eventBlock.trim();
    if (!trimmed.startsWith('data: ')) return;
    let data;
    try {
      data = JSON.parse(trimmed.slice(6));
    } catch {
      return;
    }
    if (data.type === 'chunk' && onChunk) onChunk(data.text);
    else if (data.type === 'done') finalResult = data.result;
    else if (data.type === 'error') throw new Error(data.message || 'Analysis failed');
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';
      for (const event of events) {
        handleEventLine(event);
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) {
      handleEventLine(buffer);
    }
  } finally {
    reader.releaseLock();
  }

  if (!finalResult) {
    throw new Error('Analysis completed but no result was returned. Check Ollama logs.');
  }

  return finalResult;
};
