"use client";

import { useState } from "react";
import type { AnalyzeResponse } from "@/types/analysis";

type OverlayMode = "NONE" | "CHANGE_MASK" | "NDVI";

export default function OverlayPreview({
  result,
}: {
  result: AnalyzeResponse | null;
}) {
  const [mode, setMode] = useState<OverlayMode>("CHANGE_MASK");
  const [opacity, setOpacity] = useState(55);

  const baseImage = result?.images?.afterImageUrl;
  const changeMask = result?.images?.changeMaskUrl;
  const ndviHeatmap = result?.images?.ndviHeatmapUrl;

  const overlayUrl =
    mode === "CHANGE_MASK" ? changeMask : mode === "NDVI" ? ndviHeatmap : null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#071225] p-5 shadow-xl">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40">
            Overlay Preview
          </p>
          <p className="mt-1 text-sm text-white/60">
            Change detection or NDVI heatmap on satellite base
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("CHANGE_MASK")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
              mode === "CHANGE_MASK"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            Change Mask
          </button>
          <button
            onClick={() => setMode("NDVI")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
              mode === "NDVI"
                ? "bg-green-600 text-white shadow-sm"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            NDVI Heatmap
          </button>
          <button
            onClick={() => setMode("NONE")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
              mode === "NONE"
                ? "bg-gray-700 text-white shadow-sm"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            Off
          </button>
        </div>
      </div>

      {/* Opacity control */}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-xs text-white/60 min-w-[60px]">Opacity</span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full accent-blue-500 h-1.5 rounded-full cursor-pointer"
        />
        <span className="text-xs text-white/70 min-w-[40px] text-right font-medium">
          {opacity}%
        </span>
      </div>

      {/* Preview container */}
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/30 relative">
        {!result || !baseImage ? (
          <div className="h-[280px] flex items-center justify-center text-white/50 text-sm">
            {result ? "No base image available" : "Run analysis to see preview"}
          </div>
        ) : (
          <div className="relative h-[280px] w-full">
            {/* Base satellite image */}
            <img
              src={baseImage}
              alt="Base satellite imagery"
              className="absolute inset-0 h-full w-full object-cover"
              crossOrigin="anonymous"
            />

            {/* Overlay (only shown when active) */}
            {overlayUrl && mode !== "NONE" && (
              <img
                src={overlayUrl}
                alt={`${mode} overlay`}
                className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                style={{
                  opacity: opacity / 100,
                  mixBlendMode: mode === "CHANGE_MASK" ? "screen" : "normal", // better visibility for change masks
                }}
                crossOrigin="anonymous"
              />
            )}

            {/* Floating info label */}
            <div className="absolute top-3 left-3 rounded-md bg-black/70 px-3 py-1 text-xs text-white/90 backdrop-blur-sm">
              {mode === "CHANGE_MASK" && "🔴 Change Detection Mask"}
              {mode === "NDVI" && "🌿 NDVI Vegetation Health"}
              {mode === "NONE" && "No Overlay"}
            </div>

            {/* Quick mode indicator in corner */}
            {mode !== "NONE" && (
              <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-0.5 text-xs text-white/80">
                {mode === "CHANGE_MASK" ? "Change" : "NDVI"} • {opacity}%
                opacity
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
