import { NextResponse } from "next/server";

/**
 * API Route: /api/status/[job_id]
 *
 * PROXY MODE: Forwards job status polling requests to AWS backend
 */

const AWS_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_AWS_API_BASE ||
  "https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ job_id: string }> },
) {
  try {
    const { job_id } = await params;
    const awsUrl = `${AWS_API_URL}/status/${job_id}`;

    console.log(`[API Proxy] GET ${awsUrl}`);

    const awsResponse = await fetch(awsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!awsResponse.ok) {
      const errorText = await awsResponse.text();
      return NextResponse.json(
        { error: `AWS Backend Error: ${awsResponse.status}`, details: errorText },
        { status: awsResponse.status },
      );
    }

    const awsData = await awsResponse.json();
    return NextResponse.json(awsData);
  } catch (error) {
    console.error("[API Proxy] Error:", error);
    return NextResponse.json(
      { error: "Failed to proxy status request", details: String(error) },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
