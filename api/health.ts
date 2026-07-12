// Next.js 15 Route Handler Compatibility
export async function GET(request: Request) {
  console.log("Incoming request: GET /api/health (Next.js)");
  const responseData = {
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  };
  return Response.json(responseData);
}

// Vercel Serverless Function (Express/Node.js) Compatibility
export default async function handler(req: any, res: any) {
  console.log("Incoming request: GET /api/health (Vercel Serverless)");
  
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

  const responseData = {
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  };
  return res.status(200).json(responseData);
}
