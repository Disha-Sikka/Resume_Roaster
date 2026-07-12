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

export async function POST(request: Request) {
  console.log("Incoming request: POST /api/roast");

  try {
    const body = await request.json().catch(() => ({}));
    const { text, mode, parsedResume } = body;

    if (!text || typeof text !== "string") {
      console.error("❌ Missing resume text for roasting");
      return Response.json({ error: "Missing resume text for roasting." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ Gemini API Key is missing for roasting. Please check your system environment/secrets.");
      const isProd = process.env.NODE_ENV === "production";
      const displayError = isProd 
        ? "AI analysis is temporarily unavailable. Please try again later." 
        : "Invalid API key.";
      return Response.json({
        error: `AI Analysis Error: ${displayError}`,
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
    const isProd = process.env.NODE_ENV === "production";
    const mapped = mapGeminiError(err);
    const displayError = isProd 
      ? "AI analysis is temporarily unavailable. Please try again later." 
      : mapped.error;

    return Response.json({
      error: `AI Analysis Error: ${displayError}`,
      details: isProd ? undefined : mapped.details,
    }, { status: 500 });
  }
}
