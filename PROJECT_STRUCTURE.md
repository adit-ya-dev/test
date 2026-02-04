# Project Structure

```text
.
├── public
│   ├── apple-icon.png
│   ├── avatar.png
│   ├── change.png
│   ├── favicon.ico
│   ├── file.svg
│   ├── globe.mp4
│   ├── globe.svg
│   ├── icon.png
│   ├── image.tif
│   ├── logo.png
│   ├── ndvi_monitoring.png
│   ├── next.svg
│   ├── satellite.png
│   ├── vercel.svg
│   ├── window.svg
│   └── world_map.png
├── scripts
│   ├── poke_backend.py
│   └── test_backend.py
├── src
│   ├── app
│   │   ├── alerts
│   │   │   ├── components
│   │   │   │   ├── AlertCard.tsx
│   │   │   │   ├── AlertsFilters.tsx
│   │   │   │   ├── AlertsHeader.tsx
│   │   │   │   └── AlertsList.tsx
│   │   │   └── page.tsx
│   │   ├── analysis
│   │   │   ├── components
│   │   │   │   ├── AnalysisHeader.tsx
│   │   │   │   ├── AnalysisStatsPanel.tsx
│   │   │   │   ├── AnalyzeButton.tsx
│   │   │   │   ├── ChangeOverlayPreview.tsx
│   │   │   │   ├── DateRangePicker.tsx
│   │   │   │   ├── FileUploader.tsx
│   │   │   │   ├── LeafletMapClient.tsx
│   │   │   │   ├── MapAOISelector.tsx
│   │   │   │   ├── OverlayPreview.tsx
│   │   │   │   ├── ScanProgressLog.tsx
│   │   │   │   └── VisualAnalysisHub.tsx
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   ├── alerts
│   │   │   │   └── route.ts
│   │   │   ├── analyze
│   │   │   │   └── route.ts
│   │   │   ├── dashboard
│   │   │   │   └── route.ts
│   │   │   ├── data-logs
│   │   │   │   └── route.ts
│   │   │   ├── results
│   │   │   │   └── [job_id]
│   │   │   │       └── route.ts
│   │   │   ├── scan-result
│   │   │   │   └── route.ts
│   │   │   └── scans
│   │   │       └── route.ts
│   │   ├── dashboard
│   │   │   ├── components
│   │   │   │   ├── AlertsPreview.tsx
│   │   │   │   ├── DashboardHeader.tsx
│   │   │   │   ├── NDVITrendChart.tsx
│   │   │   │   ├── RecentScansTable.tsx
│   │   │   │   ├── ResearchPapersModal.tsx
│   │   │   │   ├── StatsCards.tsx
│   │   │   │   └── ThreatLevelCard.tsx
│   │   │   ├── AppSidebar.tsx
│   │   │   └── page.tsx
│   │   ├── data-logs
│   │   │   ├── components
│   │   │   │   ├── DataLogsActions.tsx
│   │   │   │   ├── DataLogsFilters.tsx
│   │   │   │   ├── DataLogsHeader.tsx
│   │   │   │   └── DataLogsTable.tsx
│   │   │   └── page.tsx
│   │   ├── scan-result
│   │   │   ├── components
│   │   │   │   ├── ScanDownloadPanel.tsx
│   │   │   │   ├── ScanFindingsTable.tsx
│   │   │   │   ├── ScanImagesCompare.tsx
│   │   │   │   ├── ScanResultHeader.tsx
│   │   │   │   ├── ScanSummaryCards.tsx
│   │   │   │   └── ScanTimeline.tsx
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── layout
│   │   │   └── AppShell.tsx
│   │   ├── ui
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── tooltip.tsx
│   │   ├── page.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── hooks
│   │   ├── useAlerts.ts
│   │   ├── useAnalyzeRegion.ts
│   │   ├── useDashboardStats.ts
│   │   ├── useDataLogs.ts
│   │   ├── use-mobile.ts
│   │   ├── useRecentScans.ts
│   │   ├── useScanHistory.ts
│   │   └── useScanResult.ts
│   ├── lib
│   │   ├── ai-models
│   │   │   ├── changeDetection.ts
│   │   │   ├── forestInterpreter.ts
│   │   │   ├── ndviCalculator.ts
│   │   │   ├── semanticSegmentation.ts
│   │   │   └── timeSeriesAnalysis.ts
│   │   ├── alerts
│   │   │   └── alertGenerator.ts
│   │   ├── api
│   │   │   ├── alertService.ts
│   │   │   ├── analyzeService.ts
│   │   │   ├── awsClient.ts
│   │   │   ├── backendClient.ts
│   │   │   ├── scanResultService.ts
│   │   │   └── scanService.ts
│   │   ├── data-logs
│   │   │   └── dataLogsService.ts
│   │   ├── download
│   │   │   └── downloadFile.ts
│   │   ├── mock
│   │   │   └── mockData.ts
│   │   ├── scans
│   │   │   └── scanStorage.ts
│   │   ├── utils
│   │   │   ├── constants.ts
│   │   │   ├── format.ts
│   │   │   ├── severity.ts
│   │   │   └── time.ts
│   │   └── utils.ts
│   └── types
│       ├── alert.ts
│       ├── analysis.ts
│       ├── dataLogs.ts
│       ├── geo.ts
│       ├── scan.ts
│       └── scanResult.ts
├── .env.local
├── .gitignore
├── 403_ERROR_FIX.md
├── AWS_CORS_ROOT_FIX.md
├── aws-lambda-cors-fix.py
├── BACKEND_INTEGRATION.md
├── BACKEND_INTEGRATION_GUIDE.md
├── BACKEND_ONLY_UPDATE.md
├── COMPLETE_CHANGELOG.md
├── components.json
├── CORS_FIX.md
├── deploy_cors_fix.py
├── eslint.config.mjs
├── INTEGRATION_COMPLETE.md
├── MAP_RONDONIA_UPDATE.md
├── METHOD2_LAMBDA_CORS_GUIDE.md
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── PROJECT_STRUCTURE.md
├── README.md
├── ROADMAP_IMPLEMENTATION.md
├── tailwind.config.ts
├── tsconfig.json
└── URL_CHANGE_NO_DEV.md
```
