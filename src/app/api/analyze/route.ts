import { NextResponse } from "next/server";

/**
 * API Route: /api/analyze
 *
 * PROXY MODE: Forwards requests to AWS backend to avoid CORS issues
 * The browser calls this same-origin endpoint, and the Next.js server
 * forwards the request to AWS (server-to-server has no CORS restrictions)
 */

const AWS_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_AWS_API_BASE ||
  "https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev/api";

export async function POST(req: Request) {
  try {
    console.log("[API Proxy] /api/analyze - Forwarding to AWS backend...");

    // Get the request body from the frontend
    const body = await req.json();
    console.log("[API Proxy] Request body:", body);

    // Forward to AWS backend (server-to-server, no CORS issues!)
    console.log(`[API Proxy] POST ${AWS_API_URL}/analyze`);

    const awsResponse = await fetch(`${AWS_API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!awsResponse.ok) {
      const errorText = await awsResponse.text();
      console.error(`[API Proxy] AWS Error ${awsResponse.status}:`, errorText);
      return NextResponse.json(
        { error: `AWS Backend Error: ${awsResponse.status}`, details: errorText },
        { status: awsResponse.status }
      );
    }

    // Get the response from AWS
    const awsData = await awsResponse.json();
    console.log("[API Proxy] AWS Response:", awsData);

    // Return to frontend (same-origin, no CORS!)
    return NextResponse.json(awsData);

  } catch (error) {
    console.error("[API Proxy] Error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request to AWS backend", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS request for CORS preflight
 * (Though this shouldn't be needed since it's same-origin)
 */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
