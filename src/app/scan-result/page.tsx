"use client";

import ScanResultHeader from "./components/ScanResultHeader";

import ScanSummaryCards from "./components/ScanSummaryCards";

import ScanImagesCompare from "./components/ScanImagesCompare";

import ScanFindingsTable from "./components/ScanFindingsTable";

import ScanDownloadPanel from "./components/ScanDownloadPanel";

import ScanTimeline from "./components/ScanTimeline";

import { useScanResult } from "@/hooks/useScanResult";

export default function ScanResultPage() {
  const { loading, data, error, reload } = useScanResult();

  return (
    <div className="space-y-6">
      <ScanResultHeader loading={loading} error={error} onReload={reload} />

      {data && (
        <>
          <ScanSummaryCards data={data} />

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <ScanImagesCompare data={data} />

              <ScanFindingsTable data={data} />
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6">
              <ScanTimeline data={data} />

              <ScanDownloadPanel data={data} />
            </div>
          </div>
        </>
      )}

      {!loading && !data && (
        <div className="glass-card rounded-2xl p-6 text-white/70">
          No scan result found.
        </div>
      )}
    </div>
  );
}
