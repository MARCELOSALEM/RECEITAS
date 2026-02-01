
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

export const generateRecipeContent = async (recipeName: string): Promise<Recipe> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Crie uma receita detalhada e gourmet para: ${recipeName}. Forneça tempos reais, ingredientes precisos e instruções claras.`,
    config: {
      systemInstruction: "Você é um Chef Executivo de renome mundial especializado em alta gastronomia. Responda apenas em Português do Brasil utilizando o esquema JSON fornecido.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titulo: { type: Type.STRING },
          tempo: { type: Type.STRING },
          porcoes: { type: Type.STRING },
          dificuldade: { type: Type.STRING },
          ingredientes: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          instrucoes: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["titulo", "tempo", "porcoes", "dificuldade", "ingredientes", "instrucoes"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Falha ao gerar o conteúdo da receita.");
  return JSON.parse(text) as Recipe;
};

export const generateRecipeImage = async (recipeName: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `Professional high-end food photography of ${recipeName}, beautifully plated on a minimalist ceramic dish, natural soft studio lighting, macro shot, 8k resolution, cinematic aesthetic, warm tones.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Falha ao gerar a imagem da receita.");
};
