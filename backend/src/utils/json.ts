export function extractJsonArray(input: string) {
  const normalized = input.replace(/```json|```/gi, "").trim();
  const firstBracket = normalized.indexOf("[");
  const lastBracket = normalized.lastIndexOf("]");

  if (firstBracket === -1 || lastBracket === -1) {
    throw new Error("Gemini did not return a JSON array.");
  }

  return normalized.slice(firstBracket, lastBracket + 1);
}
