/**
 * Analyze Controller
 * Logic for handling analysis requests.
 */

const { generateAnalysis } = require('../services/ollamaService');

const analyzeTranscript = async (req, res) => {
  const { transcript } = req.body;

  // Validation
  if (!transcript || transcript.trim() === "") {
    return res.status(400).json({ error: "Transcript text cannot be empty." });
  }

  try {
    console.log("[CONTROLLER] Analysis request received...");
    
    // Retry logic (Image 11 requirement)
    let result;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        result = await generateAnalysis(transcript);
        break; 
      } catch (e) {
        attempts++;
        console.warn(`[RETRY] Attempt ${attempts} failed. ${e.message}`);
        if (attempts >= maxAttempts) throw e;
      }
    }

    res.json(result);
  } catch (error) {
    console.error("[CONTROLLER ERROR]", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { analyzeTranscript };
