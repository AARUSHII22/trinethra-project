/**
 * Trinethra Backend - server.js
 * Clean Architecture | Ollama Local Inference
 */

const express = require('express');
const cors    = require('cors');
const cookieParser = require('cookie-parser');
const dotenv  = require('dotenv');

dotenv.config();

const analyzeRoutes = require('./routes/analyzeRoutes');
const authRoutes    = require('./routes/authRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ─────────────────────────────────────────────────────────────
// Allow both Vite dev ports and send cookies cross-origin
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// ─── Routes ─────────────────────────────────────────────────────────────────
// Auth  →  POST /api/auth/register  |  POST /api/auth/login
app.use('/api/auth', authRoutes);

// Analysis → POST /api/analyze  (NO auth guard – auth is checked via localStorage on frontend)
app.use('/api', analyzeRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', model: process.env.OLLAMA_MODEL || 'llama3.2' }));
app.get('/', (req, res) => res.json({ message: 'Trinethra Backend Active' }));

// ─── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 Server   : http://localhost:${PORT}`);
  console.log(`🤖 AI Model : ${process.env.OLLAMA_MODEL || 'llama3.2'}`);
  console.log(`📡 Ollama   : ${process.env.OLLAMA_URL || 'http://localhost:11434/api/generate'}`);
  console.log(`========================================`);
});
