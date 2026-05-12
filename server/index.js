const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const { initDB } = require('./database');
const { authenticate } = require('./middleware/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware (Image 05: Secure Deployment & Monitoring)
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

// CORS configuration (Restrict to our frontend)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Bot Defense / Abuse Prevention (Image 04)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: 'Too many requests, please try again later.' }
});

const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 analysis requests per hour
  message: { error: 'Analysis quota exceeded for this hour.' }
});

// Routes
app.use('/api/auth', apiLimiter, authRoutes);

// API Endpoints
app.post('/api/analyze', analysisLimiter, authenticate, async (req, res) => {
  try {
    const { transcript } = req.body;
    const db = await initDB();

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }
    
    console.log(`[API] Starting analysis for user ${req.user.userId}...`);
    const result = await analyzeTranscript(transcript);
    
    // IDOR Protection: Link result to user (Image 02)
    const analysisRecord = {
      id: Date.now().toString(),
      userId: req.user.userId,
      timestamp: new Date(),
      result
    };
    
    db.data.analyses.push(analysisRecord);
    await db.write();

    res.json(result);
  } catch (error) {
    console.error('[SERVER ERROR]', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Secure endpoint to get history (Image 02: Access Control)
app.get('/api/history', authenticate, async (req, res) => {
  const db = await initDB();
  // Ensure user only sees THEIR data
  const userAnalyses = db.data.analyses.filter(a => a.userId === req.user.userId);
  res.json(userAnalyses);
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'secure', timestamp: new Date() }));

// Production: Serve static assets (Image 05: Secure Deployment)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[TRINETHRA SECURE SERVER] Running on port ${PORT} (${process.env.NODE_ENV || 'development'} mode)`);
});
