/**
 * API Service
 * Uses a relative /api path — Vite proxies it to http://localhost:5000
 * This eliminates all CORS issues in the browser.
 */

const BASE_URL = '/api';

export const post = async (endpoint, data) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Server error: ${response.status}`);
  }

  return response.json();
};

export const get = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Server error: ${response.status}`);
  }

  return response.json();
};
