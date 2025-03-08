import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export const vectorize = async (input: string): Promise<number[]> => {
  try {
    const result = await model.embedContent(input);
    return result.embedding.values;
  } catch (error) {
    console.error(error);
    return [];
  }
};
