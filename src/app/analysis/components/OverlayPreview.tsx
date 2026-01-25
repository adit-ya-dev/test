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
          <div className="h-[280px] flex flex-col items-center justify-center text-white/50 text-sm">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-3">
              {result ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )}
            </div>
            <span>{result ? "No base image available" : "Run analysis to see preview"}</span>
          </div>
        ) : (
          <div className="relative h-[280px] w-full group">
            {/* Base satellite image */}
            <img
              src={baseImage}
              alt="Base satellite imagery"
              className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
              crossOrigin="anonymous"
            />

            {/* Overlay (only shown when active) */}
            {overlayUrl && mode !== "NONE" && (
              <img
                src={overlayUrl}
                alt={`${mode} overlay`}
                className="absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: opacity / 100,
                  mixBlendMode: mode === "CHANGE_MASK" ? "screen" : "normal",
                }}
                crossOrigin="anonymous"
              />
            )}

            {/* Enhanced floating info label */}
            <div className="absolute top-3 left-3 rounded-lg bg-black/80 backdrop-blur-md px-3 py-2 text-xs text-white/90 shadow-lg border border-white/10">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  mode === "CHANGE_MASK" ? "bg-red-400" : 
                  mode === "NDVI" ? "bg-green-400" : "bg-gray-400"
                }`} />
                <span className="font-medium">
                  {mode === "CHANGE_MASK" && "Change Detection"}
                  {mode === "NDVI" && "NDVI Analysis"}
                  {mode === "NONE" && "Base Image"}
                </span>
              </div>
              {mode !== "NONE" && (
                <div className="text-xs text-white/60 mt-1">
                  Opacity: {opacity}%
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setOpacity(Math.min(100, opacity + 10))}
                className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white/80 hover:bg-black/80 transition-colors"
                title="Increase opacity"
              >
                +
              </button>
              <button 
                onClick={() => setOpacity(Math.max(0, opacity - 10))}
                className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white/80 hover:bg-black/80 transition-colors"
                title="Decrease opacity"
              >
                -
              </button>
            </div>

            {/* Quick mode indicator */}
            {mode !== "NONE" && (
              <div className="absolute bottom-3 right-3 rounded-lg bg-gradient-to-r from-black/70 to-black/50 backdrop-blur-sm px-3 py-1.5 text-xs text-white/90 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    mode === "CHANGE_MASK" ? "bg-red-400 animate-pulse" : "bg-green-400 animate-pulse"
                  }`} />
                  <span>{mode === "CHANGE_MASK" ? "Change" : "NDVI"} • {opacity}%</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
