"use client";

import "leaflet/dist/leaflet.css";
import { GeoJSON, LayersControl, MapContainer, TileLayer } from "react-leaflet";
import type { Feature, GeoJsonObject } from "geojson";
import type { JobResultsResponse } from "@/types/jobs";
import MapLegend from "./MapLegend";

const satelliteUrl =
  "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const streetsUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const terrainUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";

const colorMap: Record<string, string> = {
  deforestation: "#ef4444",
  urban_expansion: "#3b82f6",
  encroachment: "#f59e0b",
};

export default function ChangeResultsMap({
  results,
}: {
  results: JobResultsResponse["results"];
}) {
  const features: Feature[] = results.changes.map((change) => ({
    type: "Feature",
    properties: {
      change_id: change.change_id,
      type: change.type,
      area_km2: change.area_km2,
      severity: change.severity,
    },
    geometry: change.geometry,
  }));

  const geojson: GeoJsonObject = {
    type: "FeatureCollection",
    features,
  };

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

          <GeoJSON
            data={geojson}
            style={(feature) => {
              const type = feature?.properties?.type as string;
              return {
                color: colorMap[type] || "#22c55e",
                weight: 2,
                fillOpacity: 0.35,
              };
            }}
            onEachFeature={(feature, layer) => {
              const props: any = feature.properties || {};
              layer.bindPopup(
                `<div style="font-size:12px">
                  <strong>${props.type}</strong><br/>
                  Area: ${props.area_km2} km2<br/>
                  Severity: ${props.severity}
                </div>`,
              );
            }}
          />
        </MapContainer>
        <MapLegend />
      </div>
    </div>
  );
}
