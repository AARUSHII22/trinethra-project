/**
 * Ollama Service
 * Communicates with the local Ollama instance running llama3.2
 */

const axios  = require('axios');
const { getTranscriptPrompt } = require('../prompts/transcriptPrompt');
const { parseJson }           = require('../utils/parseJson');

require('dotenv').config();

const OLLAMA_URL   = process.env.OLLAMA_URL   || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

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
        // 'format: json' is a hint — some Ollama versions support it
        format: 'json',
      },
      { timeout: 120000 } // 2-minute timeout for large transcripts
    );

    const rawText = response.data?.response;

    if (!rawText) {
      throw new Error('Ollama returned an empty response. Is the model loaded?');
    }

    console.log('[OLLAMA] Raw response received, parsing JSON...');
    return parseJson(rawText);

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        'Cannot connect to Ollama. Make sure Ollama is running: open the Ollama app or run `ollama serve`.'
      );
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Ollama request timed out. The model may be loading — try again in a moment.');
    }
    throw error;
  }
};

module.exports = { generateAnalysis };
