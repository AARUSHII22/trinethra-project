/**
 * Analysis Service
 * Sends transcript to local backend → Ollama → llama3.2
 * Endpoint: POST http://localhost:5000/api/analyze
 */

import { post } from './api';

export const analyzeTranscript = async (transcript) => {
  try {
    // Hits: http://localhost:5000/api/analyze
    return await post('/analyze', { transcript });
  } catch (error) {
    console.error('[ANALYSIS SERVICE ERROR]', error.message);
    throw error;
  }
};
