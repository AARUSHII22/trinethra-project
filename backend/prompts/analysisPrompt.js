/**
 * Analysis Prompt Template
 * This file contains the structured prompt used for transcript analysis.
 * Keeping it separate makes it easier to tune the AI logic without touching the code.
 */

const getAnalysisPrompt = (transcript) => {
  return `
    You are an expert organizational psychologist and talent assessor. 
    Analyze the following interview transcript and provide a deep, structured synthesis based on the assessment rubric.

    ### RUBRIC SYSTEM:
    - Score 1-3: Need Attention (Significant gaps in ownership, reliability, or initiative)
    - Score 4-6: Productivity (Competent, reliable, but lacks high-level autonomous initiative)
    - Score 7-10: Performance (Exemplary ownership, proactive risk mitigation, and systemic thinking)

    ### TRANSCRIPT:
    """
    ${transcript}
    """

    ### OUTPUT INSTRUCTIONS:
    You must return ONLY a valid JSON object. 
    Do not include any preamble, markdown formatting (like \`\`\`json), or extra text.
    The response must be a single, clean JSON object.

    ### JSON STRUCTURE:
    {
      "rubricScore": number (1-10),
      "scoreLabel": "Need Attention" | "Productivity" | "Performance",
      "justification": "A concise (3-4 sentence) synthesis of the assessment.",
      "evidence": [
        {
          "type": "Positive" | "Neutral" | "Negative",
          "time": "MM:SS (approximate timestamp)",
          "quote": "Direct quote from transcript",
          "tags": ["Ownership", "Reliability", "Initiative", etc.]
        }
      ],
      "kpiMapping": [
        { "label": "e.g., Ownership", "value": "e.g., 85%", "status": "e.g., Target Met", "color": "text-primary" }
      ],
      "gaps": [
        { "icon": "warning", "title": "Identifying Name", "desc": "Contextual description of the gap", "type": "Critical" | "Warning" | "Observation" }
      ],
      "followUpQuestions": [
        "Probing question 1",
        "Probing question 2"
      ]
    }
  `;
};

module.exports = { getAnalysisPrompt };
