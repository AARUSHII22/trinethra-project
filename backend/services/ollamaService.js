/**
 * Ollama service — local inference at http://localhost:11434 (assignment spec: no cloud LLM).
 */

const axios = require('axios');
const { getTranscriptPrompt } = require('../prompts/transcriptPrompt');
const { parseJson } = require('../utils/parseJson');

require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

const INFERENCE_OPTIONS = {
  temperature: 0,
  num_predict: 1400,
  num_ctx: 8192,
  top_k: 1,
};

const generateAnalysis = async (transcript) => {
  const prompt = getTranscriptPrompt(transcript);
  console.log(`[OLLAMA] Sending to ${OLLAMA_MODEL} at ${OLLAMA_URL}`);

  try {
    const response = await axios.post(
      OLLAMA_URL,
      {
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        format: 'json',
        options: INFERENCE_OPTIONS,
      },
      { timeout: 600000 }
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
      throw new Error('Ollama request timed out after 10 minutes. Try a smaller model (llama3.2:1b) or shorten the transcript.');
    }
    const status = error.response?.status;
    const ollamaMsg = error.response?.data?.error || error.response?.data?.message;
    if (status === 404) {
      throw new Error(
        `Ollama has no model matching "${OLLAMA_MODEL}". Run: ollama pull ${OLLAMA_MODEL}   Then check: ollama list`
      );
    }
    if (ollamaMsg) {
      throw new Error(`Ollama: ${ollamaMsg}`);
    }
    throw error;
  }
};

const generateAnalysisStream = async (transcript, onChunk) => {
  const prompt = getTranscriptPrompt(transcript);
  console.log(`[OLLAMA STREAM] Starting stream with ${OLLAMA_MODEL}`);

  try {
    const response = await axios.post(
      OLLAMA_URL,
      {
        model: OLLAMA_MODEL,
        prompt,
        stream: true,
        format: 'json',
        options: INFERENCE_OPTIONS,
      },
      {
        timeout: 600000,
        responseType: 'stream',
      }
    );

    let accumulated = '';
    let lineBuffer = '';

    await new Promise((resolve, reject) => {
      response.data.on('data', (chunk) => {
        lineBuffer += chunk.toString();
        const lines = lineBuffer.split('\n');
        lineBuffer = lines.pop() ?? '';

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
            /* non-JSON line */
          }
        }
      });

      response.data.on('end', resolve);
      response.data.on('error', reject);
    });

    if (lineBuffer.trim()) {
      try {
        const parsed = JSON.parse(lineBuffer.trim());
        if (parsed.response) accumulated += parsed.response;
      } catch {
        /* ignore */
      }
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
      throw new Error('Ollama stream timed out after 10 minutes. Try a smaller model (llama3.2:1b) or shorten the transcript.');
    }
    const status = error.response?.status;
    const ollamaMsg = error.response?.data?.error || error.response?.data?.message;
    if (status === 404) {
      throw new Error(
        `Ollama has no model matching "${OLLAMA_MODEL}". Run: ollama pull ${OLLAMA_MODEL}   Then check: ollama list`
      );
    }
    if (ollamaMsg) {
      throw new Error(`Ollama: ${ollamaMsg}`);
    }
    throw error;
  }
};

module.exports = { generateAnalysis, generateAnalysisStream };
