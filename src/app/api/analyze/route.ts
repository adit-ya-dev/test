import { NextResponse } from "next/server";
import type { AOIRequest } from "@/types/geo";

export async function POST(req: Request) {
  try {
    console.log("Received analyze request");
    
    let body: AOIRequest;
    try {
      body = (await req.json()) as AOIRequest;
      console.log("Request body:", body);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.bbox || !body.startDate || !body.endDate) {
      console.error("Missing required fields:", { bbox: !!body.bbox, startDate: !!body.startDate, endDate: !!body.endDate });
      return NextResponse.json(
        { error: "Missing required fields: bbox, startDate, endDate" },
        { status: 400 }
      );
    }

    // Validate bbox structure
    if (typeof body.bbox.north === 'undefined' || typeof body.bbox.south === 'undefined' || 
        typeof body.bbox.east === 'undefined' || typeof body.bbox.west === 'undefined') {
      console.error("Invalid bbox structure:", body.bbox);
      return NextResponse.json(
        { error: "Invalid bbox format. Expected: { north, south, east, west }" },
        { status: 400 }
      );
    }

  const mock = {
    status: "COMPLETED",
    scanId: `SCAN-${Math.floor(Math.random() * 9000) + 1000}`,
    severity: "WARNING",

    ndvi: {
      mean: 0.41,
      min: 0.08,
      max: 0.79,
      healthStatus: "MODERATE",
    },

    transitions: {
      forestToUrbanPercent: 14.6,
      waterToLandPercent: 2.3,
    },

    images: {
      beforeImageUrl:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop",
      afterImageUrl:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400&auto=format&fit=crop",

      // ✅ Mock overlays (transparent PNGs should be used ideally)
      // For demo we use any image (later replace with real masks from AWS)
      changeMaskUrl:
        "https://images.unsplash.com/photo-1520975693411-b1f2f3e7d6b2?q=80&w=1400&auto=format&fit=crop",
      ndviHeatmapUrl:
        "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?q=80&w=1400&auto=format&fit=crop",
    },

    message: `Mock analysis completed for bbox (${body.bbox.south.toFixed(
      3,
    )}, ${body.bbox.west.toFixed(3)})`,
  };

  return NextResponse.json(mock);
    
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
