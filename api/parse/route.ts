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
  console.log("Incoming request: POST /api/parse");

  try {
    const body = await request.json().catch(() => ({}));
    const { text } = body;

    if (!text || typeof text !== "string") {
      console.error("❌ Missing resume text for parsing");
      return Response.json({ error: "Missing resume text for parsing." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ Gemini API Key is missing. Please check your system environment/secrets.");
      const isProd = process.env.NODE_ENV === "production";
      const displayError = isProd 
        ? "AI analysis is temporarily unavailable. Please try again later." 
        : "Invalid API key.";
      return Response.json({
        error: `Parsing Error: ${displayError}`,
      }, { status: 500 });
    }

    const ai = getGeminiClient();
    const prompt = `
You are a precise resume parser. Extract information from the following raw resume text and format it into the requested JSON schema.
If certain fields like certifications or projects are not present, return empty arrays. Be as comprehensive and accurate as possible.

Resume Text:
${text}
`;

    console.log("Gemini request: Parsing resume with gemini-3.5-flash");
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

    console.log("Gemini response received");

    if (!response.text) {
      throw new Error("No text returned from Gemini parser.");
    }

    const parsedJson = JSON.parse(response.text.trim());
    console.log("Resume parsed");
    console.log("Returned JSON:", JSON.stringify(parsedJson));
    return Response.json(parsedJson);
  } catch (err: any) {
    console.error("❌ Resume parsing failed with error:", err);
    const isProd = process.env.NODE_ENV === "production";
    const mapped = mapGeminiError(err);
    const displayError = isProd 
      ? "AI analysis is temporarily unavailable. Please try again later." 
      : mapped.error;

    return Response.json({
      error: `Parsing Error: ${displayError}`,
      details: isProd ? undefined : mapped.details,
    }, { status: 500 });
  }
}
