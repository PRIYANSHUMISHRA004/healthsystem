import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODEL = "gemini-1.5-flash";

const getGeminiClient = (): GoogleGenerativeAI => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  return new GoogleGenerativeAI(apiKey);
};

const sanitizeBullet = (line: string): string =>
  line.replace(/^[-*•]\s*/, "").trim();

export const findBestMatchingEquipment = async (
  query: string,
  equipmentNames: string[]
): Promise<string> => {
  if (!query.trim()) {
    throw new Error("Query is required.");
  }

  if (!equipmentNames.length) {
    throw new Error("equipmentNames cannot be empty.");
  }

  const ai = getGeminiClient();
  const model = ai.getGenerativeModel({ model: GEMINI_MODEL });

  const prompt = `Based on this query, return the most relevant equipment from this list: [${equipmentNames.join(", ")}].
User query: "${query}".
Return exactly one equipment name from the list and nothing else.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text().trim();

  const normalizedMatch = equipmentNames.find(
    (name) => name.toLowerCase() === responseText.toLowerCase()
  );

  if (normalizedMatch) {
    return normalizedMatch;
  }

  const fallbackMatch = equipmentNames.find((name) =>
    responseText.toLowerCase().includes(name.toLowerCase())
  );

  return fallbackMatch ?? equipmentNames[0];
};

export const summarizeReviews = async (reviews: string[]): Promise<string[]> => {
  if (!reviews.length) {
    throw new Error("reviews cannot be empty.");
  }

  const ai = getGeminiClient();
  const model = ai.getGenerativeModel({ model: GEMINI_MODEL });

  const prompt = `Summarize the following doctor/equipment reviews into exactly 3 concise bullet points:
${reviews.map((review, index) => `${index + 1}. ${review}`).join("\n")}

Return plain text with only 3 bullet points.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text().trim();

  const bullets = responseText
    .split("\n")
    .map((line) => sanitizeBullet(line))
    .filter((line) => line.length > 0)
    .slice(0, 3);

  if (bullets.length === 3) {
    return bullets;
  }

  return [responseText, "", ""].slice(0, 3).map((line) => line.trim());
};
