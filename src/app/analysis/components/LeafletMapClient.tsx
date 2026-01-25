"use client";

import { useEffect, useRef, useState } from "react";

export default function LeafletMapClient({
  onBboxChange,
}: {
  onBboxChange: (bbox: any) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const rectangleRef = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    const initMap = () => {
      // @ts-ignore
      const L = window.L;
      if (!L || mapInstance.current) return;

      // Initialize Map with Satellite View (Esri World Imagery)
      const map = L.map(mapRef.current, {
        zoomControl: false, // We will move controls or hide them for a cleaner UI
      }).setView([28.6139, 77.209], 12);

      mapInstance.current = map;

      // Satellite Tile Layer
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community",
        },
      ).addTo(map);

      let startPoint: any = null;

      // Mousedown: Start drawing
      map.on("mousedown", (e: any) => {
        if (!drawingMode) return;

        map.dragging.disable();
        startPoint = e.latlng;

        // Remove existing selection if user starts drawing a new one
        if (rectangleRef.current) {
          map.removeLayer(rectangleRef.current);
        }

        rectangleRef.current = L.rectangle([startPoint, startPoint], {
          color: "#60a5fa", // Bright blue for satellite visibility
          weight: 2,
          fillOpacity: 0.3,
          interactive: true, // Allows it to be selected/deleted
        }).addTo(map);
      });

      // Mousemove: Update size
      map.on("mousemove", (e: any) => {
        if (!startPoint || !rectangleRef.current) return;
        rectangleRef.current.setBounds(L.latLngBounds(startPoint, e.latlng));
      });

      // Mouseup: Finalize and save
      map.on("mouseup", () => {
        if (!startPoint || !rectangleRef.current) return;

        const bounds = rectangleRef.current.getBounds();
        onBboxChange({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });

        startPoint = null;
        map.dragging.enable();
        setDrawingMode(false); // Disable drawing mode so map can be panned
        setHasSelection(true); // Show the delete button
      });

      setMapLoaded(true);
    };

    // Load Assets
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!(window as any).L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      // Clean up map on unmount
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [drawingMode]);

  const handleClear = () => {
    if (rectangleRef.current && mapInstance.current) {
      mapInstance.current.removeLayer(rectangleRef.current);
      rectangleRef.current = null;
      setHasSelection(false);
    }
  };

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
      <div
        ref={mapRef}
        className="w-full h-full z-0"
        style={{ cursor: drawingMode ? "crosshair" : "grab" }}
      />

      {/* Floating UI Controls - NOW ON THE RIGHT SIDE */}
      <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-3">
        <button
          onClick={() => setDrawingMode(!drawingMode)}
          className={`p-4 rounded-xl backdrop-blur-xl border-2 transition-all flex items-center justify-center ${
            drawingMode
              ? "bg-blue-500 border-blue-300 text-white shadow-lg shadow-blue-500/40"
              : "bg-black/70 border-white/20 text-white hover:bg-black/90"
          }`}
          title="Draw Area of Interest"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
          </svg>
        </button>

        {hasSelection && (
          <button
            onClick={handleClear}
            className="p-4 rounded-xl bg-red-500/80 border-2 border-red-400 text-white backdrop-blur-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center"
            title="Delete Selection"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Status Indicators */}
      {drawingMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-blue-600/90 text-white px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase backdrop-blur-md z-[1000] animate-pulse">
          Drawing Mode Active
        </div>
      )}

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-[2000]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400" />
            <span className="text-white/60 text-xs font-mono tracking-tighter uppercase">
              Loading Imagery...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
