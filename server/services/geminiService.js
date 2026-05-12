const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const analyzeTranscript = async (transcript) => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing on the server.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert organizational psychologist and talent assessor. 
    Analyze the following interview transcript and provide a deep, structured synthesis based on the DT Fellow Assessment Rubric.

    ### RUBRIC SYSTEM:
    - Score 1-3: Need Attention (Significant gaps in ownership, reliability, or initiative)
    - Score 4-6: Productivity (Competent, reliable, but lacks high-level autonomous initiative)
    - Score 7-10: Performance (Exemplary ownership, proactive risk mitigation, and systemic thinking)

    ### TRANSCRIPT:
    """
    ${transcript}
    """

    ### OUTPUT FORMAT:
    You must return ONLY a valid JSON object. Do not include markdown formatting or extra text.
    The JSON structure MUST be:
    {
      "rubricScore": number (1-10),
      "scoreLabel": "Need Attention" | "Productivity" | "Performance",
      "justification": "A concise (3-4 sentence) synthesis of their assessment, focusing on behavioral patterns and diagnostic depth.",
      "evidence": [
        {
          "type": "Positive" | "Neutral" | "Negative",
          "time": "MM:SS",
          "quote": "Direct quote",
          "tags": ["Ownership", "Reliability", etc.]
        }
      ],
      "kpiMapping": [
        { "label": "e.g., Ownership", "value": "85%", "status": "Target Met", "color": "text-primary" }
      ],
      "gaps": [
        { "icon": "warning", "title": "Identifying Name", "desc": "Description", "type": "Critical" }
      ],
      "followUpQuestions": [
        "Question 1",
        "Question 2"
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON object found in response");
  
  return JSON.parse(jsonMatch[0]);
};

module.exports = { analyzeTranscript };
