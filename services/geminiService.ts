import { GoogleGenAI, Type } from "@google/genai";
import { StoryboardScene } from "../types";

// Initialize the API client
// Ideally, in a real app, we would handle missing keys more gracefully in the UI
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelId = "gemini-2.5-flash";

export const generateStoryboardFromConcept = async (concept: string): Promise<StoryboardScene[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const systemInstruction = `
    You are the 'Meta-AI Storyboard Creator'. Your role is to visually articulate complex AI concepts, 
    processes, and workflows as defined in the Meta-AI Playbook. 
    
    Your task is to take a conceptual input and break it down into a sequence of visual scenes for a storyboard.
    Focus on:
    1. Clarity: The visual description should be easy to sketch.
    2. Narrative Flow: Ensure logical progression.
    3. Meta-AI Aesthetics: Use terms like "nodes", "connections", "digital interface", "holographic", "data streams" where appropriate.
    
    Output strictly valid JSON.
  `;

  const prompt = `Create a 4-6 scene storyboard for the following concept: "${concept}".`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: { type: Type.INTEGER },
              title: { type: Type.STRING },
              visual: { type: Type.STRING, description: "Detailed visual description of the scene" },
              action: { type: Type.STRING, description: "What is happening in the scene" },
              dialogue: { type: Type.STRING, description: "Any spoken words or text on screen" },
              notes: { type: Type.STRING, description: "Additional production notes" }
            },
            required: ["sceneNumber", "title", "visual", "action", "dialogue"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as StoryboardScene[];

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const refineSceneWithAI = async (scene: StoryboardScene, instruction: string): Promise<StoryboardScene> => {
    if (!apiKey) {
        throw new Error("API Key is missing");
    }

    const prompt = `
        Current Scene:
        Title: ${scene.title}
        Visual: ${scene.visual}
        Action: ${scene.action}
        Dialogue: ${scene.dialogue}

        Refinement Instruction: ${instruction}

        Return the updated scene object in JSON.
    `;

    const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
             responseSchema: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  visual: { type: Type.STRING },
                  action: { type: Type.STRING },
                  dialogue: { type: Type.STRING },
                  notes: { type: Type.STRING }
                },
                required: ["sceneNumber", "title", "visual", "action", "dialogue"]
            }
        }
    });

    const text = response.text;
    if(!text) throw new Error("No response");
    
    return JSON.parse(text) as StoryboardScene;
}
