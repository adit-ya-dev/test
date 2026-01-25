"use client";

import dynamic from "next/dynamic";
import type { BoundingBox } from "@/types/geo";
import type { AnalyzeResponse } from "@/types/analysis";

import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

// ✅ Dynamic import to avoid "window is not defined"
const LeafletMapClient = dynamic(() => import("./LeafletMapClient"), {
  ssr: false,
});

export default function MapAOISelector({
  onBboxChange,
  result,
}: {
  onBboxChange: (bbox: BoundingBox) => void;
  result: AnalyzeResponse | null;
}) {
  const beforeImage =
    result?.images?.beforeImageUrl ||
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop";

  const afterImage =
    result?.images?.afterImageUrl ||
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400&auto=format&fit=crop";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#071225] p-5 shadow-xl">
      <p className="text-xs uppercase tracking-widest text-white/40">
        Map AOI + Before/After Comparison
      </p>

      <p className="mt-1 text-sm text-white/60">
        Draw rectangle AOI • Click Analyze to load before/after imagery
      </p>

      {/* ✅ MAP (client-only) */}
      <div className="mt-4">
        <LeafletMapClient onBboxChange={onBboxChange} />
      </div>

      {/* ✅ Before/After Slider */}
      <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
        <p className="text-xs uppercase tracking-widest text-white/40">
          Before vs After (Swipe)
        </p>

        <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
          <ReactCompareSlider
            itemOne={<ReactCompareSliderImage src={beforeImage} alt="Before" />}
            itemTwo={<ReactCompareSliderImage src={afterImage} alt="After" />}
          />
        </div>
      </div>
    </div>
  );
}
