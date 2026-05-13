/**
 * API Service
 * Uses a relative /api path — Vite proxies it to http://localhost:5000
 * This eliminates all CORS issues in the browser.
 */

const BASE_URL = '/api';

/**
 * @param {string} endpoint
 * @param {object} data
 * @param {{ timeoutMs?: number, signal?: AbortSignal }} [opts]
 */
export const post = async (endpoint, data, opts = {}) => {
  const timeoutMs = opts.timeoutMs ?? 120_000;
  const controller = new AbortController();

  if (opts.signal) {
    if (opts.signal.aborted) controller.abort();
    else opts.signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || `Server error: ${response.status}`);
    }

    return response.json();
  } catch (e) {
    if (e?.name === 'AbortError') {
      throw new Error(`Request timed out or was cancelled (after ${Math.round(timeoutMs / 1000)}s). Try a smaller Ollama model or shorten the transcript.`);
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
};

export const get = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Server error: ${response.status}`);
  }

  return response.json();
};
