"use client";

import { useState } from "react";
import AnalysisHeader from "./components/AnalysisHeader";
import MapAOISelector from "./components/MapAOISelector";
import VisualResultsCard from "./components/VisualAnalysisHub";
import DateRangePicker from "./components/DateRangePicker";
import AnalyzeButton from "./components/AnalyzeButton";
import AnalysisStatsPanel from "./components/AnalysisStatsPanel";
import ScanProgressLog from "./components/ScanProgressLog";
import { FileUploader } from "./components/FileUploader";
import type { BoundingBox } from "@/types/geo";
import { useAnalyzeRegion } from "@/hooks/useAnalyzeRegion";
import { daysAgoISO, todayISO } from "@/lib/utils/time";

export default function MapAnalysisPage() {
  const [bbox, setBbox] = useState<BoundingBox | null>(null);
  const [startDate, setStartDate] = useState(() => daysAgoISO(365));
  const [endDate, setEndDate] = useState(() => todayISO());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { run, loading, result, error, progress } = useAnalyzeRegion();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-[150] bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <AnalysisHeader />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: PRIMARY WORKSPACE */}
          <div className="lg:col-span-8 space-y-8">
            {/* Map Block */}
            <div className="rounded-2xl border border-border shadow-xl overflow-hidden h-[550px] bg-card">
              <MapAOISelector onBboxChange={setBbox} result={result} />
            </div>

            {/* Action/Command Block */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(s, e) => {
                      setStartDate(s);
                      setEndDate(e);
                    }}
                  />
                </div>
                <div className="md:w-56 w-full">
                  <AnalyzeButton
                    loading={loading}
                    disabled={!bbox || loading}
                    onClick={() =>
                      run(
                        {
                          bbox: bbox!,
                          startDate,
                          endDate,
                          regionName: "Selected AOI",
                        },
                        selectedFile || undefined
                      )
                    }
                  />
                </div>
              </div>
              
              {/* File Upload Section */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">
                  Upload Satellite Imagery (Optional)
                </p>
                <FileUploader
                  onFileSelect={setSelectedFile}
                  accept=".tif,.tiff"
                  maxSizeMB={100}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Upload a .tif file to analyze with the backend API. Without a file, mock data will be used.
                </p>
              </div>
            </div>

            {/* Visual Hub */}
            {result && <VisualResultsCard result={result} />}
          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6">
            <AnalysisStatsPanel bbox={bbox} result={result} error={error} />
            <ScanProgressLog loading={loading} result={result} progress={progress} />
          </aside>
        </div>
      </main>
    </div>
  );
}
