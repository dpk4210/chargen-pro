import { GoogleGenAI } from "@google/genai";
import { CharacterParams } from "../types";

export const checkApiKey = async (): Promise<boolean> => {
  // Hanya cek apakah process.env.API_KEY tersedia
  return !!process.env.API_KEY;
};

export const promptSelectKey = async (): Promise<void> => {
  // Karena kita hanya menggunakan env key, beri peringatan jika fungsi ini terpanggil
  alert("Mode Dev: Harap atur process.env.API_KEY di kode sumber atau konfigurasi lingkungan Anda.");
};

interface GenerateResult {
  image: string;
  prompt: string;
}

export const generateCharacterImage = async (params: CharacterParams): Promise<GenerateResult> => {
  // Construct a highly detailed prompt based on user input
  const outfit = params.outfit.trim() || "tanktop putih ketat dan denim short";
  
  // Defaults if empty
  const artStyle = params.artStyle || 'Realistic';
  const background = params.background || 'White Background';
  const pose = params.pose || 'Standing Straight';

  const prompt = `
    Generate a high-quality ${artStyle} style full-body portrait of a character with the following specific traits:
    
    1.  **Setting & Action**:
        *   **Background**: ${background}
        *   **Pose**: ${pose}

    2.  **Physical Appearance**:
        *   **Race/Ethnicity**: ${params.race || 'unspecified'}
        *   **Skin Color**: ${params.skinColor || 'natural'}
        *   **Age**: ${params.age || 'young adult'}
        *   **Height**: ${params.height || 'average'}
        *   **Body Shape**: ${params.bodyShape || 'average'}, ${params.bodyDetails}
        *   **Measurements**: Chest: ${params.chest || 'average'}, Waist: ${params.waist || 'average'}, Hips: ${params.hips || 'average'}
    
    3.  **Face & Head**:
        *   **Face Shape**: ${params.faceShape || 'average'}
        *   **Face Details**: ${params.faceDetails}
        *   **Hair**: ${params.hairShape || ''} style, ${params.hairLength || ''} length, ${params.hairColor || ''} color
        *   **Eyebrows**: ${params.eyebrows || 'natural'}
        *   **Eyes**: ${params.eyes || 'detailed'}
        *   **Nose**: ${params.nose || 'average'}
        *   **Mouth**: ${params.mouth || 'average'}

    4.  **Attire**:
        *   Wearing: ${outfit}

    5.  **Quality & Technical**:
        *   Masterpiece, best quality, highly detailed, ${artStyle === 'Realistic' ? '8k, photorealistic, cinematic lighting' : 'detailed art, vibrant colors'}.
        *   Aspect Ratio: 3:4 (Portrait)
  `;

  try {
    // Determine API Key source: Strictly use env
    const apiKey = process.env.API_KEY; 
    
    if (!apiKey) {
      throw new Error("process.env.API_KEY tidak ditemukan/kosong. Harap set API Key.");
    }

    // Create a NEW instance for every call
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
          // imageSize is NOT supported in gemini-2.5-flash-image
        },
      },
    });

    // Parse Response
    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return {
            image: `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`,
            prompt: prompt
          };
        }
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Modified error handling for env key
    if (error.message?.includes('API key') || error.status === 403) {
      throw new Error("API Key env tidak valid. Cek konfigurasi.");
    }
    throw error;
  }
};