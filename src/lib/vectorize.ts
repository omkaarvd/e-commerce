import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const vectorize = async (input: string): Promise<number[]> => {
  try {
    const result = await genAI.models.embedContent({
      model: "text-embedding-004",
      contents: input,
    });
    if (result.embeddings) {
      return result.embeddings[0].values ?? [];
    }
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
