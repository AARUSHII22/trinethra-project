/**
 * Supervisor transcript → structured draft analysis (Ollama).
 * Injects rubric.json and context.txt per assignment spec.
 */

const { getAssignmentPayload } = require('../utils/assignmentData');

const sanitizeTranscript = (transcript) =>
  transcript
    .replace(/```/g, '')
    .replace(/###/g, '')
    .trim()
    .substring(0, 50000);

const getTranscriptPrompt = (transcript) => {
  const sanitized = sanitizeTranscript(transcript);
  const { rubric, contextMd } = getAssignmentPayload();

  const dimensionList = rubric.assessmentDimensions
    .map((d) => `- id: "${d.id}" | name: ${d.name} | ${d.description}`)
    .join('\n');

  const rubricJson = JSON.stringify(rubric);

  return `You are an organizational psychologist assisting DeepThought (PDGMS / Trinethra).
You analyze SUPERVISOR FEEDBACK CALL TRANSCRIPTS about a Fellow (embedded operator in an Indian manufacturing MSME).

The rubric and dimension list below are authoritative. The KPI table is in the CONTEXT document—map only to the eight KPIs defined there.

### CONTEXT (human-readable domain + KPI definitions)
${contextMd}

### RUBRIC (structured JSON — use bands, levels, and assessmentDimensions exactly)
${rubricJson}

### DIMENSION IDS (for gap analysis — use these exact "dimensionId" values in gaps)
${dimensionList}

### TRANSCRIPT
"""
${sanitized}
"""

### TASK
Return ONE JSON object (no markdown, no commentary) with this shape:

{
  "rubricScore": <integer 1-10>,
  "scoreLabel": "Need Attention" | "Productivity" | "Performance",
  "justification": "<one paragraph, 4-7 sentences, citing specific evidence quotes or paraphrases tied to rubric bands>",
  "evidence": [
    {
      "type": "Positive" | "Neutral" | "Negative",
      "time": "<MM:SS approximate, or \"n/a\" if unknown>",
      "quote": "<verbatim or tight paraphrase from transcript—do not invent>",
      "tags": ["<short rubric-linked tag>", "..."]
    }
  ],
  "kpiMapping": [
    {
      "kpiId": "<one of: on_time_delivery | throughput_productivity | quality_rework | inventory_material | cost_waste | safety_compliance | cash_working_capital | people_accountability>",
      "label": "<human-readable KPI name matching CONTEXT>",
      "value": "<one line: how the Fellow connects based ONLY on what the supervisor said>",
      "status": "Strong link" | "Moderate link" | "Weak / indirect" | "Not evidenced",
      "color": "text-primary"
    }
  ],
  "gaps": [
    {
      "dimensionId": "<id from assessmentDimensions OR \"kpi_coverage\">",
      "icon": "warning",
      "title": "<short title>",
      "desc": "<explain that this dimension or KPI was NOT substantiated with behavioral evidence in THIS transcript—absence reasoning, not generic advice>",
      "type": "Critical" | "Warning" | "Observation"
    }
  ],
  "followUpQuestions": [
    "<3 to 5 questions the intern should ask on the next call; each question should target one gap or weak KPI>"
  ]
}

### RULES
1. evidence: between 4 and 8 items when the transcript allows; fewer only if the transcript is very short. Each quote must appear in or be a faithful paraphrase of the TRANSCRIPT.
2. kpiMapping: include ALL eight KPIs as rows. Use "Not evidenced" when the supervisor gave no usable signal for that KPI.
3. gaps: at least 3 items. Prefer dimensions/KPIs with NO clear behavioral evidence. "Critical" if a core Fellow dimension (e.g. systems_building, reliability_followthrough) is missing for a long transcript.
4. followUpQuestions: length 3–5; each should name what you are probing (e.g. systems, team response, dispatch proof).
5. scoreLabel must match rubricScore using rubric.bands ranges.
6. Return ONLY valid JSON.`;

};

module.exports = { getTranscriptPrompt, sanitizeTranscript };
