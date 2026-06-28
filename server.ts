import express from "express";
import path from "path";
import multer from "multer";
// @ts-ignore
import { extractPdfText } from "./src/lib/pdf";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";

// Initialize Gemini API
let ai: GoogleGenAI | null = null;
const initGemini = () => {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY environment variable is missing.");
    } else {
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  }
  return ai;
};

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: "50mb" }));

  // API route: Extract text from PDF
  app.post("/api/extract-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const text = await extractPdfText(req.file.buffer);

    res.json({
      text,
    });
  } catch (error: any) {
    console.error("PDF Extraction error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

  // API route: Call Gemini API to extract research structure
  app.post("/api/analyze-thesis", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const gemini = initGemini();
      if (!gemini) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      const prompt = `Analyze this thesis document and extract the research structure.
Return a valid JSON object with the following fields:
- title: string
- background: string
- research_questions: string[]
- objectives: string[]
- theories: string[]
- methodology: object (key-value pairs)
- findings: string[]
- conclusion: string

Text to analyze:
${text.substring(0, 100000)} // Truncating to avoid huge token counts if necessary
`;

     const response = await gemini.models.console.log("Sending request to Gemini...");generateContent({console.log("Gemini responded");
  model: "gemini-2.5-flash",
  contents: prompt,
  config: {
    responseMimeType: "application/json",
  },
});

let resultText = response.text ?? "";

// Bersihkan markdown jika ada
resultText = resultText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

console.log("Gemini Response:");
console.log(resultText);

try {
  const result = JSON.parse(resultText);
  res.json(result);
} catch (err) {
  console.error("Invalid JSON from Gemini:");
  console.log(resultText);

  res.status(500).json({
    error: "Gemini returned invalid JSON",
  });
}
    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API route: Call Gemini API to generate mind map from structure
  app.post("/api/generate-mindmap", async (req, res) => {
    try {
      const { analysis } = req.body;
      if (!analysis) {
        return res.status(400).json({ error: "Analysis data is required" });
      }

      const gemini = initGemini();
      if (!gemini) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      const prompt = `Based on the following research structure, generate a presentation-oriented mind map.
The output MUST be a valid JSON object representing the root node of the mind map.
It should have exactly one central topic (the root), major branches for chapters/sections, sub-branches for key concepts, and leaf nodes for supporting evidence. Max depth 5, max 7 children per node. Prefer keywords over sentences.

JSON structure:
{
  "id": "root",
  "label": "Research Title",
  "children": [
    {
      "id": "node_1",
      "label": "Background",
      "children": [...]
    }
  ]
}

Research Structure:
${JSON.stringify(analysis, null, 2)}
`;

      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        },
      });

      const resultText = response.text || "{}";
      const result = JSON.parse(resultText);

      res.json(result);
    } catch (error: any) {
      console.error("Mindmap Generation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API route: Call Gemini API to plan presentation
  app.post("/api/plan-presentation", async (req, res) => {
      try {
          const { mindmap } = req.body;
          if (!mindmap) return res.status(400).json({ error: "Mindmap is required" });
          
          const gemini = initGemini();
          if (!gemini) return res.status(500).json({ error: "Gemini API key is not configured" });

          const prompt = `Convert the following mind map into a 7-slide presentation blueprint.
Each slide must have:
- id: string
- title: string
- slideObjective: string
- keywords: string[]
- suggestedLayout: string
- presenterNotes: string (opening sentence, explanation, transition, time estimate)
- estimatedDuration: string (e.g. "2 Minutes")

Return a JSON object with a "slides" array.

Mind Map:
${JSON.stringify(mindmap)}
`;

        const response = await gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        res.json(JSON.parse(response.text || "{}"));
      } catch (error: any) {
        console.error("Presentation Planning error:", error);
        res.status(500).json({ error: error.message });
      }
  });

  // API route: Call Gemini to generate defense questions
  app.post("/api/generate-defense", async (req, res) => {
    try {
        const { presentation } = req.body;
        if (!presentation) return res.status(400).json({ error: "Presentation is required" });
        
        const gemini = initGemini();
        if (!gemini) return res.status(500).json({ error: "Gemini API key is not configured" });

        const prompt = `Analyze this presentation and predict 5 examiner questions for a thesis defense.
Each question must include:
- id: string
- question: string
- category: string (Background, Theory, Methodology, Findings, Discussion, Conclusion, Limitation, Future Research)
- difficulty: string (Easy, Medium, Hard)
- reason: string (why it might be asked)
- suggestedAnswer: string
- improvementTips: string

Return a JSON object with a "questions" array.

Presentation:
${JSON.stringify(presentation)}
`;

      const response = await gemini.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
              responseMimeType: "application/json",
          }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Defense Generation error:", error);
      res.status(500).json({ error: error.message });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
