import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
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

// Next.js 15 Route Handler Compatibility
export async function POST(request: Request) {
  console.log("Incoming request: POST /api/roast (Next.js)");
  try {
    const body = await request.json().catch(() => ({}));
    const { text, mode, parsedResume } = body;

    if (!text || typeof text !== "string") {
      console.error("❌ Missing resume text for roasting");
      return Response.json({ error: "Missing resume text for roasting." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ Gemini API Key is missing for roasting.");
      return Response.json({
        error: "AI Analysis Error: AI analysis is temporarily unavailable. Please try again later.",
      }, { status: 500 });
    }

    const roastMode = mode || "savage";
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
To ensure blazing-fast performance, keep your comments sharp and direct, and limit the 'mistakes' array to exactly 3 items, and the 'improvements' array to exactly 3 items.

Here is the raw resume text:
${text}

${parsedResume ? `Here is the parsed metadata for context:\n${JSON.stringify(parsedResume, null, 2)}` : ""}

Mode Instructions:
${modeInstruction}

Please analyze the resume and return a JSON object adhering exactly to the following JSON schema. Ensure you return ONLY valid JSON:
{
  "overallScore": number,
  "atsScore": number,
  "grammarScore": number,
  "designScore": number,
  "skillsScore": number,
  "experienceScore": number,
  "roast": "text",
  "mistakes": [
    {
      "section": "text",
      "issue": "text",
      "severity": "low" | "medium" | "high" | "critical",
      "funnyComment": "text",
      "fix": "text"
    }
  ],
  "improvements": [
    {
      "section": "text",
      "suggestion": "text",
      "impact": "text"
    }
  ],
  "summarySuggestion": "text",
  "suggestedSkills": ["skill"],
  "keywordsMissing": ["keyword"],
  "interviewReadiness": "text",
  "finalVerdict": "text"
}
`;

    const ai = getGeminiClient();

    console.log(`Gemini request: Roasting resume with gemini-3.5-flash under mode ${roastMode}`);
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
                  severity: { type: Type.STRING },
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

    console.log("Gemini response received");

    if (!response.text) {
      throw new Error("No text returned from Gemini.");
    }

    const roastedJson = JSON.parse(response.text.trim());
    console.log("Returned JSON:", JSON.stringify(roastedJson));
    return Response.json(roastedJson);
  } catch (err: any) {
    console.error("❌ Resume roasting failed with error:", err);
    const mapped = mapGeminiError(err);
    return Response.json({
      error: `AI Analysis Error: AI analysis is temporarily unavailable. Please try again later.`,
      details: mapped.details,
    }, { status: 500 });
  }
}

// Vercel Serverless Function (Express/Node.js) Compatibility
export default async function handler(req: any, res: any) {
  console.log("Incoming request: POST /api/roast (Vercel Serverless)");
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const text = req.body?.text;
    const mode = req.body?.mode;
    const parsedResume = req.body?.parsedResume;

    if (!text || typeof text !== "string") {
      console.error("❌ Missing resume text for roasting");
      return res.status(400).json({ error: "Missing resume text for roasting." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ Gemini API Key is missing for roasting.");
      return res.status(500).json({
        error: "AI Analysis Error: AI analysis is temporarily unavailable. Please try again later.",
      });
    }

    const roastMode = mode || "savage";
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
To ensure blazing-fast performance, keep your comments sharp and direct, and limit the 'mistakes' array to exactly 3 items, and the 'improvements' array to exactly 3 items.

Here is the raw resume text:
${text}

${parsedResume ? `Here is the parsed metadata for context:\n${JSON.stringify(parsedResume, null, 2)}` : ""}

Mode Instructions:
${modeInstruction}

Please analyze the resume and return a JSON object adhering exactly to the following JSON schema. Ensure you return ONLY valid JSON:
{
  "overallScore": number,
  "atsScore": number,
  "grammarScore": number,
  "designScore": number,
  "skillsScore": number,
  "experienceScore": number,
  "roast": "text",
  "mistakes": [
    {
      "section": "text",
      "issue": "text",
      "severity": "low" | "medium" | "high" | "critical",
      "funnyComment": "text",
      "fix": "text"
    }
  ],
  "improvements": [
    {
      "section": "text",
      "suggestion": "text",
      "impact": "text"
    }
  ],
  "summarySuggestion": "text",
  "suggestedSkills": ["skill"],
  "keywordsMissing": ["keyword"],
  "interviewReadiness": "text",
  "finalVerdict": "text"
}
`;

    const ai = getGeminiClient();

    console.log(`Gemini request: Roasting resume with gemini-3.5-flash under mode ${roastMode}`);
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
                  severity: { type: Type.STRING },
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

    console.log("Gemini response received");

    if (!response.text) {
      throw new Error("No text returned from Gemini.");
    }

    const roastedJson = JSON.parse(response.text.trim());
    console.log("Returned JSON:", JSON.stringify(roastedJson));
    return res.status(200).json(roastedJson);
  } catch (err: any) {
    console.error("❌ Resume roasting failed with error:", err);
    const mapped = mapGeminiError(err);
    return res.status(500).json({
      error: `AI Analysis Error: AI analysis is temporarily unavailable. Please try again later.`,
      details: mapped.details,
    });
  }
}
