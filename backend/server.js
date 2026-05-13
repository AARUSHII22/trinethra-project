/**
 * Trinethra Backend — Supervisor Feedback Analyzer
 * Local Ollama only (assignment spec).
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const analyzeRoutes = require('./routes/analyzeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
}));
app.use(express.json({ limit: '1mb' }));

app.use('/api', analyzeRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', model: process.env.OLLAMA_MODEL || 'llama3.2' }));
app.get('/', (req, res) => res.json({ message: 'Trinethra Supervisor Feedback Analyzer (local)' }));

app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

app.listen(PORT, () => {
  console.log('========================================');
  console.log(`Server   : http://localhost:${PORT}`);
  console.log(`AI Model : ${process.env.OLLAMA_MODEL || 'llama3.2'}`);
  console.log(`Ollama   : ${process.env.OLLAMA_URL || 'http://localhost:11434/api/generate'}`);
  console.log('========================================');
});
