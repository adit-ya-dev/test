"use client";

import { useState } from "react";
import AnalysisHeader from "./components/AnalysisHeader";
import MapAOISelector from "./components/MapAOISelector";
import DateRangePicker from "./components/DateRangePicker";
import AnalyzeButton from "./components/AnalyzeButton";
import AnalysisStatsPanel from "./components/AnalysisStatsPanel";
import ScanProgressLog from "./components/ScanProgressLog";
import OverlayPreview from "./components/OverlayPreview";
import type { BoundingBox } from "@/types/geo";
import { useAnalyzeRegion } from "@/hooks/useAnalyzeRegion";
import { daysAgoISO, todayISO } from "@/lib/utils/time";

export default function MapAnalysisPage() {
  const [bbox, setBbox] = useState<BoundingBox | null>(null);
  const [startDate, setStartDate] = useState(daysAgoISO(365));
  const [endDate, setEndDate] = useState(todayISO());

  const { run, loading, result, error } = useAnalyzeRegion();

  const handleAnalyze = async () => {
    if (!bbox) {
      alert("Please select an area on the map first!");
      return;
    }
    await run({
      bbox,
      startDate,
      endDate,
      regionName: "Selected AOI",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020817] to-[#0a1425] text-white pb-12">
      {/* Header – high z-index so map never overlays it */}
      <div className="sticky top-0 z-50 bg-[#071225]/95 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4 lg:px-6">
          <AnalysisHeader />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
          {/* LEFT COLUMN – Map + Controls + Overlay */}
          <div className="lg:col-span-8 space-y-6">
            {/* Map Section */}
            <div className="relative z-0">
              <MapAOISelector onBboxChange={setBbox} result={result} />
            </div>

            {/* Controls Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onChange={(s, e) => {
                  setStartDate(s);
                  setEndDate(e);
                }}
              />

              <AnalyzeButton
                loading={loading}
                disabled={!bbox || loading}
                onClick={handleAnalyze}
              />

              {/* AOI Status Card */}
              <div className="rounded-2xl border border-white/10 bg-[#071225]/70 backdrop-blur-sm p-5 shadow-xl">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-3">
                  AOI Status
                </p>
                <div className="text-sm text-white/80 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Selected:</span>
                    <span
                      className={`font-semibold ${bbox ? "text-green-400" : "text-red-400"}`}
                    >
                      {bbox ? "YES" : "NO"}
                    </span>
                  </div>

                  {bbox && (
                    <div className="text-xs text-white/60 grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <span>North:</span>{" "}
                        <span className="text-white/90">
                          {bbox.north?.toFixed(4)}
                        </span>
                      </div>
                      <div>
                        <span>South:</span>{" "}
                        <span className="text-white/90">
                          {bbox.south?.toFixed(4)}
                        </span>
                      </div>
                      <div>
                        <span>East:</span>{" "}
                        <span className="text-white/90">
                          {bbox.east?.toFixed(4)}
                        </span>
                      </div>
                      <div>
                        <span>West:</span>{" "}
                        <span className="text-white/90">
                          {bbox.west?.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Overlay Preview */}
            <OverlayPreview result={result} />
          </div>

          {/* RIGHT COLUMN – Stats + Progress */}
          <div className="lg:col-span-4 space-y-6">
            <AnalysisStatsPanel bbox={bbox} result={result} error={error} />

            <ScanProgressLog loading={loading} result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
