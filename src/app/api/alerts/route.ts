import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    note: "Alerts are generated client-side from scan history (hackathon mode).",
  });
}
