import { GoogleGenAI, Type } from "@google/genai";
import { AIAppDetails } from "../types";

// Initialize the API client
// Note: In a real environment, ensure process.env.API_KEY is set.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generateAppDetails = async (appName: string, url: string): Promise<AIAppDetails | null> => {
  if (!apiKey) {
    return null;
  }

  try {
    const prompt = `
      I am adding a web application to my dashboard.
      App Name: "${appName}"
      App URL: "${url}"
      
      Please generate a short, catchy description (max 15 words).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
          },
          required: ["description"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as AIAppDetails;

  } catch (error) {
    console.error("Error generating app details with Gemini:", error);
    return null;
  }
};
