/**
 * JSON Parsing Utility
 * Cleans AI responses and parses them into JS objects.
 */

const parseJson = (text) => {
  try {
    // Remove potential markdown wrappers
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    
    // Find the first { and last } to isolate the JSON object
    const startIdx = cleanText.indexOf('{');
    const endIdx = cleanText.lastIndexOf('}');
    
    if (startIdx === -1 || endIdx === -1) {
      throw new Error("No JSON object found in AI response");
    }
    
    const jsonStr = cleanText.substring(startIdx, endIdx + 1);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("[PARSE ERROR]", error.message);
    throw new Error("Failed to parse AI response into valid JSON");
  }
};

module.exports = { parseJson };
