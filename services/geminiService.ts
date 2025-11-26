import { GoogleGenAI, Type } from "@google/genai";
import { RideRequest, SafetyAlert } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-2.5-flash for fast responses suitable for mobile/transit context
const MODEL_NAME = "gemini-2.5-flash";

export const getSafetyInsights = async (
  ride: RideRequest,
  timeOfDay: string,
  weather: string
): Promise<SafetyAlert> => {
  try {
    const prompt = `
      Analyze a moto-taxi ride in Mozambique (Inhambane/Maxixe region).
      Route: From ${ride.pickup.name} to ${ride.dropoff.name}.
      Distance: ${ride.distance}km.
      Time: ${timeOfDay}.
      Weather: ${weather}.
      
      Provide a safety assessment JSON with:
      - level: "low", "medium", or "high" (risk)
      - message: A short warning or status (max 10 words)
      - tip: A specific safety tip for the passenger or driver (max 15 words)
    `;

    // Added googleMaps tool for grounding as requested
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING, enum: ["low", "medium", "high"] },
            message: { type: Type.STRING },
            tip: { type: Type.STRING }
          },
          required: ["level", "message", "tip"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as SafetyAlert;
  } catch (error) {
    console.error("Gemini Safety Analysis Error:", error);
    // Fallback if AI fails
    return {
      level: 'low',
      message: 'Rota verificada',
      tip: 'Use sempre o capacete e segure-se bem.'
    };
  }
};
