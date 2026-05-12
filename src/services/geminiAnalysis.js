import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the SDK
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Real Gemini AI Analysis Service for Trinethra
 */
export const runGeminiAnalysis = async (transcript) => {
  // Using the latest stable model as of mid-2026
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Analyze the following interview transcript and provide a structured organizational synthesis assessment.
    
    Transcript:
    "${transcript}"
    
    Return the response ONLY as a valid JSON object with the following structure:
    {
      "score": number (1-10),
      "label": "string (A short diagnostic title for the candidate, e.g., 'Proactive Orchestrator')",
      "justification": "string (A paragraph summarizing their overall performance, diagnostic capabilities, and behavioral tendencies)",
      "evidence": [
        {
          "type": "Positive" | "Neutral" | "Negative",
          "time": "string (MM:SS, approximate if not provided)",
          "quote": "string (Direct quote from the transcript)",
          "tags": ["string"]
        }
      ],
      "kpis": [
        { "label": "string", "value": "string (e.g., '85%')", "status": "string", "color": "text-primary" | "text-secondary" }
      ],
      "gaps": [
        { "icon": "string (Material symbol name)", "title": "string", "desc": "string", "type": "Critical" | "Warning" | "Observation" }
      ],
      "followUpQuestions": ["string"]
    }

    The assessment should be based on the DT Fellow rubric (focusing on ownership, risk-assessment, reliability, and initiative).
    Ensure you find at least 4-5 evidence quotes.
    Map at least 3 KPIs and 3 Gaps.
    Provide 4 meaningful follow-up questions.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown formatting from Gemini
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback to gemini-pro if 2.0-flash fails
    if (error.message.includes("not found")) {
       console.log("Retrying with gemini-2.0-pro...");
       const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.0-pro" });
       const fallbackResult = await fallbackModel.generateContent(prompt);
       const fallbackResponse = await fallbackResult.response;
       const fallbackText = fallbackResponse.text();
       const fallbackCleanJson = fallbackText.replace(/```json/g, "").replace(/```/g, "").trim();
       return JSON.parse(fallbackCleanJson);
    }
    throw new Error("Failed to synthesize transcript via Gemini API.");
  }
};
