export async function GET(request: Request) {
  console.log("Incoming request: GET /api/health");
  const responseData = {
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  };
  console.log("Returned JSON:", JSON.stringify(responseData));
  return Response.json(responseData);
}
