import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for larger resume uploads / text sizes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY environment variable is not defined!");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy_key_to_prevent_crash",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Route: Check Health & API key status
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

function mapGeminiError(err: any): { error: string; details: string } {
  const message = String(err?.message || err || "").toLowerCase();
  
  let friendlyMessage = "Failed to roast resume with Gemini AI.";
  if (message.includes("quota") || message.includes("429") || message.includes("limit") || message.includes("exhausted")) {
    friendlyMessage = "Gemini quota exceeded.";
  } else if (message.includes("api_key") || message.includes("api key") || message.includes("key not") || message.includes("invalid") || message.includes("403") || message.includes("unauthorized") || message.includes("401")) {
    friendlyMessage = "Invalid API key.";
  } else if (message.includes("model not found") || message.includes("404") || message.includes("not found")) {
    friendlyMessage = "Model not found.";
  } else if (message.includes("timeout") || message.includes("timed out") || message.includes("deadline")) {
    friendlyMessage = "Request timed out.";
  } else if (message.includes("json") || message.includes("parse") || message.includes("syntax")) {
    friendlyMessage = "JSON parsing failed.";
  }
  
  return {
    error: friendlyMessage,
    details: err.message || String(err),
  };
}

// API Route: Parse Resume text into structured fields
app.post("/api/parse", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing resume text for parsing." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Gemini API Key is missing. Please check your system environment/secrets.");
    const isProd = process.env.NODE_ENV === "production";
    const displayError = isProd 
      ? "AI analysis is temporarily unavailable. Please try again later." 
      : "Invalid API key.";
    return res.status(500).json({
      error: `Parsing Error: ${displayError}`,
    });
  }

  try {
    console.log("\n--- PARSING FLOW STARTED ---");
    console.log("Resume uploaded ✅");
    console.log(`Characters extracted: ${text.length}`);
    console.log("Sending request to Gemini parser...");

    const ai = getGeminiClient();
    const prompt = `
You are a precise resume parser. Extract information from the following raw resume text and format it into the requested JSON schema.
If certain fields like certifications or projects are not present, return empty arrays. Be as comprehensive and accurate as possible.

Resume Text:
${text}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Full name of the candidate" },
            email: { type: Type.STRING, description: "Email address" },
            phone: { type: Type.STRING, description: "Phone number" },
            skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of technical and soft skills" },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  school: { type: Type.STRING, description: "School or University name" },
                  degree: { type: Type.STRING, description: "Degree, Major or Certificate name" },
                  year: { type: Type.STRING, description: "Graduation year or date range (e.g., 2018 - 2022)" }
                },
                required: ["school", "degree"]
              }
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING, description: "Company name" },
                  role: { type: Type.STRING, description: "Job title / role" },
                  duration: { type: Type.STRING, description: "Employment duration (e.g., 2021 - Present)" },
                  description: { type: Type.STRING, description: "Bullet points or description of duties and accomplishments" }
                },
                required: ["company", "role"]
              }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Project title" },
                  description: { type: Type.STRING, description: "Brief description of the project" },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Technologies or tools used" }
                },
                required: ["title"]
              }
            },
            certifications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Certifications obtained" }
          },
          required: ["name", "email", "skills", "education", "experience"]
        }
      }
    });

    console.log("Received response from parser.");
    console.log("Parsing JSON...");

    if (!response.text) {
      throw new Error("No text returned from Gemini parser.");
    }

    const parsedJson = JSON.parse(response.text.trim());
    console.log("Resume parsed ✅");
    console.log("Done.");
    console.log("--- PARSING FLOW COMPLETED ---\n");
    return res.json(parsedJson);
  } catch (err: any) {
    console.error("❌ Resume parsing failed with error:", err);
    const isProd = process.env.NODE_ENV === "production";
    const mapped = mapGeminiError(err);
    const displayError = isProd 
      ? "AI analysis is temporarily unavailable. Please try again later." 
      : mapped.error;

    return res.status(500).json({
      error: `Parsing Error: ${displayError}`,
      details: isProd ? undefined : mapped.details,
    });
  }
});

// API Route: Roast Resume text with selected roast mode
app.post("/api/roast", async (req, res) => {
  const { text, mode, parsedResume } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing resume text for roasting." });
  }

  const roastMode = mode || "savage";
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Gemini API Key is missing for roasting. Please check your system environment/secrets.");
    const isProd = process.env.NODE_ENV === "production";
    const displayError = isProd 
      ? "AI analysis is temporarily unavailable. Please try again later." 
      : "Invalid API key.";
    return res.status(500).json({
      error: `AI Analysis Error: ${displayError}`,
    });
  }

  try {
    console.log("\n--- ROAST FLOW STARTED ---");
    console.log("Resume uploaded ✅");
    console.log("Resume parsed ✅");
    console.log(`Characters extracted: ${text.length}`);
    console.log("Sending request to Gemini...");

    const ai = getGeminiClient();

    let modeInstruction = "";
    if (roastMode === "friendly") {
      modeInstruction = "Use friendly, lighthearted humor. Like an older sibling teasing them gently but wanting them to succeed. A mix of 'you got this' and 'why did you list Microsoft Word as a skill?'.";
    } else if (roastMode === "savage") {
      modeInstruction = "Use highly sarcastic, witty, and biting humor. Call out cliches, buzzwords, format disasters, and overly-embellished accomplishments. Make fun of their corporate-speak, but keep it clever and extremely entertaining.";
    } else if (roastMode === "brutal") {
      modeInstruction = "Use brutally funny, direct, and devastating roasts. Tear apart their experience, education, formatting, and choice of buzzwords with no filter. Make hilariously exaggerated jokes about their career choices, but never attack them personally (e.g., race, gender, appearance). All roasts must be focused strictly on the resume content itself.";
    } else if (roastMode === "hr") {
      modeInstruction = "Use highly corporate, passive-aggressive recruiter speak. Use words like 'synergy', 'alignment', 'bandwidth', and 'moving forward'. Say things like 'While we find your decision to list that 3-month gap as a freelance sabbatical interesting...', sounding overly polite but cuttingly sarcastic.";
    } else if (roastMode === "ats") {
      modeInstruction = "Speak like an artificial intelligence resume-parsing robot that is experiencing a severe syntax error and absolute existential disappointment. Use mechanical/robotic lingo, code-like logs, and computing analogies (e.g., 'CRITICAL EXCEPTION: Experience density does not meet human standards', 'Buzzword overflow in sector 7').";
    }

    const systemInstruction = `
You are Resume Roaster AI. Roast resumes in a humorous but respectful way. Your goal is to entertain while giving professional, actionable advice. Never insult the person personally. Roast only the resume.
Your output MUST be a valid JSON object matching the requested schema. Ensure all fields are fully populated with highly customized, hilarious, and genuinely helpful advice.
`;

    const prompt = `
You are Resume Roaster AI. You are roasting the resume of this candidate in "${roastMode}" mode.
Here is the raw resume text:
${text}

${parsedResume ? `Here is the parsed metadata for context:\n${JSON.stringify(parsedResume, null, 2)}` : ""}

Mode Instructions:
${modeInstruction}

Please analyze the resume and return a JSON object adhering exactly to the following JSON schema. Ensure you return ONLY valid JSON:
{
  "overallScore": number (out of 100, be realistic. If the resume is terrible, don't be afraid to give a 45. If excellent, maybe 85. No one gets a 100),
  "atsScore": number (out of 100, based on keyword density, formatting parsability, standard section titles),
  "grammarScore": number (out of 100, reflecting word choice, tense consistency, spelling),
  "designScore": number (out of 100, reflecting formatting, section structure, readability),
  "skillsScore": number (out of 100, technical skill alignment and relevance),
  "experienceScore": number (out of 100, impact statements, metric usage, action verbs),
  
  "roast": "A long, structured, hilarious, multi-paragraph roast focusing on their specific formatting, buzzwords, career progression, skills list, and education. Make it extremely funny and tailored directly to their content.",
  
  "mistakes": [
    {
      "section": "The section name (e.g. 'Skills', 'Experience', 'Header', 'Summary', 'Formatting')",
      "issue": "The specific mistake found (e.g. 'Used 15 emojis in contact details', 'Listed standard skills as expert accomplishments')",
      "severity": "low" | "medium" | "high" | "critical",
      "funnyComment": "A sarcastic, sharp, witty roast comment about this mistake",
      "fix": "Actionable, professional advice on how to fix this"
    }
  ],
  "improvements": [
    {
      "section": "Section name",
      "suggestion": "Detailed, professional step-by-step recommendation on how to enhance this section",
      "impact": "The career or ATS impact of this suggestion"
    }
  ],
  "summarySuggestion": "A suggested highly professional, modern, and compelling resume summary to replace their current one.",
  "suggestedSkills": ["List of 5 to 10 actual hard/soft skills they should highlight to look more professional in their field"],
  "keywordsMissing": ["List of 5 to 10 industry-standard keywords / buzzwords they missed that are critical for passing ATS filters in their target industry"],
  "interviewReadiness": "A hilarious but helpful rating and review of how ready they are for an interview based on this resume.",
  "finalVerdict": "A final witty closing line or verdict summarizing their career prospects based on this resume."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            atsScore: { type: Type.INTEGER },
            grammarScore: { type: Type.INTEGER },
            designScore: { type: Type.INTEGER },
            skillsScore: { type: Type.INTEGER },
            experienceScore: { type: Type.INTEGER },
            roast: { type: Type.STRING },
            mistakes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  section: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
                  funnyComment: { type: Type.STRING },
                  fix: { type: Type.STRING }
                },
                required: ["section", "issue", "severity", "funnyComment", "fix"]
              }
            },
            improvements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  section: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                  impact: { type: Type.STRING }
                },
                required: ["section", "suggestion", "impact"]
              }
            },
            summarySuggestion: { type: Type.STRING },
            suggestedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywordsMissing: { type: Type.ARRAY, items: { type: Type.STRING } },
            interviewReadiness: { type: Type.STRING },
            finalVerdict: { type: Type.STRING }
          },
          required: [
            "overallScore", "atsScore", "grammarScore", "designScore", "skillsScore", "experienceScore",
            "roast", "mistakes", "improvements", "summarySuggestion", "suggestedSkills", "keywordsMissing",
            "interviewReadiness", "finalVerdict"
          ]
        }
      }
    });

    console.log("Received response.");
    console.log("Parsing JSON...");

    if (!response.text) {
      throw new Error("No text returned from Gemini roaster.");
    }

    const roastedJson = JSON.parse(response.text.trim());
    console.log("Done.");
    console.log("--- ROAST FLOW COMPLETED ---\n");
    return res.json(roastedJson);
  } catch (err: any) {
    console.error("❌ Resume roasting failed with error:", err);
    const isProd = process.env.NODE_ENV === "production";
    const mapped = mapGeminiError(err);
    const displayError = isProd 
      ? "AI analysis is temporarily unavailable. Please try again later." 
      : mapped.error;

    return res.status(500).json({
      error: `AI Analysis Error: ${displayError}`,
      details: isProd ? undefined : mapped.details,
    });
  }
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Resume Roaster AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
