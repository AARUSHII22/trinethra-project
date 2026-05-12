/**
 * Transcript Analysis Prompt
 * Contains the logic and instructions for the LLM.
 */

const getTranscriptPrompt = (transcript) => {
  return `
    You are an expert organizational psychologist. 
    Analyze the interview transcript below and return a structured JSON assessment.

    ### TRANSCRIPT:
    """
    ${transcript}
    """

    ### REQUIREMENTS:
    - Score: 1-10 (1-3: Need Attention, 4-6: Productivity, 7-10: Performance)
    - Extraction: Exactly 5 evidence items.
    - KPI: Map at least 3 connections.
    - Gaps: Identify 3 critical observations.
    - Follow-up: 4 probing questions.

    ### STRICT JSON FORMAT:
    {
      "rubricScore": number,
      "scoreLabel": "Need Attention" | "Productivity" | "Performance",
      "justification": "text",
      "evidence": [
        { "type": "Positive" | "Neutral" | "Negative", "time": "MM:SS", "quote": "text", "tags": ["tag1"] }
      ],
      "kpiMapping": [
        { "label": "text", "value": "text", "status": "text", "color": "text-primary" }
      ],
      "gaps": [
        { "icon": "warning", "title": "text", "desc": "text", "type": "Critical" }
      ],
      "followUpQuestions": ["text"]
    }

    Return ONLY the JSON. No other text.
  `;
};

module.exports = { getTranscriptPrompt };
