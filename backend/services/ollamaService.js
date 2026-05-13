/**
 * Ollama Service
 * Communicates with the local Ollama instance.
 * Provides both a blocking call and a streaming call.
 */

const axios  = require('axios');
const { getTranscriptPrompt } = require('../prompts/transcriptPrompt');
const { parseJson }           = require('../utils/parseJson');

require('dotenv').config();

const OLLAMA_URL   = process.env.OLLAMA_URL   || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

// Inference options that reduce latency without sacrificing quality
const INFERENCE_OPTIONS = {
  temperature: 0,
  num_predict: 2800,
  top_k: 1,
};

// ── Blocking (non-streaming) ─────────────────────────────────────────────────
const generateAnalysis = async (transcript) => {
  const prompt = getTranscriptPrompt(transcript);
  console.log(`[OLLAMA] Sending to ${OLLAMA_MODEL} at ${OLLAMA_URL}`);

  try {
    const response = await axios.post(
      OLLAMA_URL,
      {
        model:   OLLAMA_MODEL,
        prompt,
        stream:  false,
        format:  'json',
        options: INFERENCE_OPTIONS,
      },
      { timeout: 300000 } // 5-minute timeout
    );

    const rawText = response.data?.response;
    if (!rawText) {
      throw new Error('Ollama returned an empty response. Is the model loaded?');
    }

    console.log('[OLLAMA] Raw response received, parsing JSON...');
    return parseJson(rawText);

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to Ollama. Make sure Ollama is running: open the Ollama app or run `ollama serve`.');
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new Error('Ollama request timed out after 5 minutes. Try a smaller model (llama3.2:1b) or free up RAM.');
    }
    throw error;
  }
};

// ── Streaming ────────────────────────────────────────────────────────────────
// Calls onChunk(text) for each partial token, returns the parsed JSON result.
const generateAnalysisStream = async (transcript, onChunk) => {
  const prompt = getTranscriptPrompt(transcript);
  console.log(`[OLLAMA STREAM] Starting stream with ${OLLAMA_MODEL}`);

  try {
    const response = await axios.post(
      OLLAMA_URL,
      {
        model:   OLLAMA_MODEL,
        prompt,
        stream:  true,
        format:  'json',
        options: INFERENCE_OPTIONS,
      },
      {
        timeout:      300000,
        responseType: 'stream',
      }
    );

    let accumulated = '';
    let lineBuffer  = '';

    await new Promise((resolve, reject) => {
      response.data.on('data', (chunk) => {
        lineBuffer += chunk.toString();
        const lines = lineBuffer.split('\n');
        lineBuffer = lines.pop() ?? ''; // keep partial last line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.error) {
              reject(new Error(`Ollama error: ${parsed.error}`));
              return;
            }
            if (parsed.response) {
              accumulated += parsed.response;
              onChunk(parsed.response);
            }
            if (parsed.done) {
              resolve();
            }
          } catch {
            // non-JSON line — skip
          }
        }
      });

      response.data.on('end', resolve);
      response.data.on('error', reject);
    });

    // Process any remaining buffered data after stream ends
    if (lineBuffer.trim()) {
      try {
        const parsed = JSON.parse(lineBuffer.trim());
        if (parsed.response) accumulated += parsed.response;
      } catch { /* ignore */ }
    }

    if (!accumulated) {
      throw new Error('Ollama returned an empty stream. Is the model loaded?');
    }

    console.log('[OLLAMA STREAM] Complete, parsing JSON...');
    return parseJson(accumulated);

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to Ollama. Make sure Ollama is running: open the Ollama app or run `ollama serve`.');
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new Error('Ollama stream timed out. Try a smaller model (llama3.2:1b) or free up RAM.');
    }
    throw error;
  }
};

module.exports = { generateAnalysis, generateAnalysisStream };
