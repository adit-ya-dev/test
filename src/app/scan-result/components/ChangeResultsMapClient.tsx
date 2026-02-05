"use client";

import "leaflet/dist/leaflet.css";
import {
  Marker,
  Popup,
  LayersControl,
  MapContainer,
  TileLayer,
} from "react-leaflet";
import type { JobResultsResponse, ResultChangeType } from "@/types/jobs";
import MapLegend from "./MapLegend";

const satelliteUrl =
  "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const streetsUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const terrainUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";

const colorMap: Record<ResultChangeType, string> = {
  deforestation: "#ef4444",
  urban: "#3b82f6",
  encroachment: "#f59e0b",
};

export default function ChangeResultsMapClient({
  results,
}: {
  results: JobResultsResponse;
}) {
  const points = results.top_changes || [];

  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-card relative z-0">
      <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
            Change Overlay
          </p>
          <p className="text-xs text-muted-foreground">
            Colored polygons represent detected changes
          </p>
        </div>
      </div>
      <div className="relative h-[420px] z-0">
        <MapContainer
          center={{ lat: -10.5, lng: -63.0 }}
          zoom={7}
          minZoom={6}
          maxZoom={18}
          className="h-full w-full z-0"
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Satellite">
              <TileLayer url={satelliteUrl} />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Streets">
              <TileLayer url={streetsUrl} />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Terrain">
              <TileLayer url={terrainUrl} />
            </LayersControl.BaseLayer>
          </LayersControl>

          {points.map((change, idx) => (
            <Marker
              key={`${change.type}-${idx}`}
              position={[change.location.lat, change.location.lon]}
            >
              <Popup>
                <div style={{ fontSize: "12px" }}>
                  <strong>{change.type}</strong>
                  <br />
                  Area: {change.area_km2.toFixed(2)} km2
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <MapLegend />
      </div>
    </div>
  );
}
