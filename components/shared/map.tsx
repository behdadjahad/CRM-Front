"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

interface MapProps {
  onSelectLocation?: (lat: number, lng: number) => void;
  defaultCenter?: [number, number];
  zoom?: number;
}

// Fix default marker icon (Leaflet bug in Next.js / Vite)
const DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ onSelectLocation }: { onSelectLocation?: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onSelectLocation?.(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function Map({ onSelectLocation, defaultCenter = [ 29.621915950920616 ,52.52763069801793], zoom = 13 }: MapProps) {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelectLocation={onSelectLocation} />
      </MapContainer>
    </div>
  );
}

