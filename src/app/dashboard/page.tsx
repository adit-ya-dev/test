"use client";

import DashboardHeader from "./components/DashboardHeader";
import StatsCards from "./components/StatsCards";
import ThreatLevelCard from "./components/ThreatLevelCard";
import NDVITrendChart from "./components/NDVITrendChart";
import RecentScansTable from "./components/RecentScansTable";
import AlertsPreview from "./components/AlertsPreview";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-6">
      <DashboardHeader />
      
      <div className="space-y-6">
        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <ThreatLevelCard />
          </div>

          <div className="lg:col-span-8">
            <NDVITrendChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <RecentScansTable />
          </div>

          <div className="lg:col-span-4">
            <AlertsPreview />
          </div>
        </div>
      </div>
    </div>
  );
}