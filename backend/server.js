/**
 * Trinethra Backend — Supervisor Feedback Analyzer (local Ollama only).
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const analyzeRoutes = require('./routes/analyzeRoutes');

/** Base URL e.g. http://localhost:11434 from OLLAMA_URL */
function ollamaBaseUrl() {
  const u = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
  return u.replace(/\/api\/generate\/?$/i, '').replace(/\/$/, '') || 'http://localhost:11434';
}

function modelTagMatches(installedName, configured) {
  const c = (configured || '').trim();
  if (!c) return false;
  return installedName === c || installedName.startsWith(`${c}:`);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
}));
app.use(express.json({ limit: '1mb' }));

app.use('/api', analyzeRoutes);

app.get('/api/health', async (req, res) => {
  const configuredModel = process.env.OLLAMA_MODEL || 'llama3.2';
  const base = ollamaBaseUrl();

  try {
    const { data } = await axios.get(`${base}/api/tags`, { timeout: 5000 });
    const models = (data?.models || []).map((m) => m.name);
    const modelFound = models.some((name) => modelTagMatches(name, configuredModel));

    return res.json({
      status: modelFound ? 'ok' : 'degraded',
      backend: 'ok',
      llm: 'ollama',
      ollamaReachable: true,
      ollamaBase: base,
      configuredModel,
      modelFound,
      installedModels: models,
      hint: modelFound
        ? undefined
        : `Configured OLLAMA_MODEL="${configuredModel}" is not in ollama list. Run: ollama pull ${configuredModel}`,
    });
  } catch (e) {
    const refused = e.code === 'ECONNREFUSED';
    return res.json({
      status: 'degraded',
      backend: 'ok',
      llm: 'ollama',
      ollamaReachable: false,
      ollamaBase: base,
      configuredModel,
      ollamaError: refused
        ? 'Connection refused — open the Ollama app or run `ollama serve` in a terminal.'
        : (e.message || 'Unknown error'),
      hint: refused
        ? 'On Windows: start Ollama from the Start menu; wait until the whale icon is idle, then retry.'
        : 'Check firewall/VPN; Ollama must listen on port 11434.',
    });
  }
});

app.get('/', (req, res) => res.json({ message: 'Trinethra Supervisor Feedback Analyzer (local Ollama)' }));

app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

app.listen(PORT, () => {
  console.log('========================================');
  console.log(`Server   : http://localhost:${PORT}`);
  console.log(`Ollama   : ${process.env.OLLAMA_URL || 'http://localhost:11434/api/generate'}`);
  console.log(`Model    : ${process.env.OLLAMA_MODEL || 'llama3.2'}`);
  console.log('========================================');
});
