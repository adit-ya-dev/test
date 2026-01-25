"use client";

import { useRef } from "react";
import type { BoundingBox } from "@/types/geo";

import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import type L from "leaflet";

export default function LeafletMapClient({
  onBboxChange,
}: {
  onBboxChange: (bbox: BoundingBox) => void;
}) {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  const handleCreated = (e: any) => {
    const layer = e.layer;
    const bounds = layer.getBounds();

    const bbox: BoundingBox = {
      minLat: bounds.getSouthWest().lat,
      minLon: bounds.getSouthWest().lng,
      maxLat: bounds.getNorthEast().lat,
      maxLon: bounds.getNorthEast().lng,
    };

    onBboxChange(bbox);
  };

  return (
    <div className="h-[420px] overflow-hidden rounded-xl border border-white/10">
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri"
        />

        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            draw={{
              rectangle: true,
              polygon: false,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}
