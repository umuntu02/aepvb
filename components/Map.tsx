"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  markerText?: string;
  className?: string;
}

export function Map({
  latitude,
  longitude,
  zoom = 13,
  markerText = "A.E.P.V.B",
  className = "",
}: MapProps) {
  // Fix for default marker icon issue in Next.js
  useEffect(() => {
    if (typeof window !== "undefined") {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
    }
  }, []);

  // Bujumbura, Burundi coordinates
  const position: [number, number] = [latitude, longitude];

  return (
    <div className={`w-full ${className}`}>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg"
        style={{ minHeight: "300px", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="text-center">
              <strong>{markerText}</strong>
              <br />
              <span className="text-sm text-gray-600">
                Kigobe, Avenue Adolphe Nshimirimana
                <br />
                Immeuble Robbialac n°8
                <br />
                Bujumbura, Burundi
              </span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
