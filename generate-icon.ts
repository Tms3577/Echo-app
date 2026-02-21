import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key found in environment variables.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function generateIcon() {
  console.log("Generating icon...");
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: "A minimalist, high-fidelity app icon for an app called 'Echo'. The design should feature a neon cyan pulse or wave on a deep obsidian black background. Glassmorphism style, sleek, modern, vector-like. Centered, symmetrical. No text.",
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const buffer = Buffer.from(part.inlineData.data, 'base64');
          const publicDir = path.resolve(__dirname, 'public');
          
          if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir);
          }

          fs.writeFileSync(path.join(publicDir, 'icon-512.png'), buffer);
          console.log("Icon saved to public/icon-512.png");
          
          fs.writeFileSync(path.join(publicDir, 'icon-192.png'), buffer);
          console.log("Icon saved to public/icon-192.png");
          return;
        }
      }
    }
    console.error("No image data found in response");

  } catch (error) {
    console.error("Error generating icon:", error);
  }
}

generateIcon();
