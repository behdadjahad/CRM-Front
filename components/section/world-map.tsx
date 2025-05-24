"use client";

import { MapContainer, GeoJSON } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";

type CountryData = { label: string; value: number };
interface WorldMapProps {
  countryData: CountryData[];
}

export default function WorldMap({ countryData }: WorldMapProps) {
  const [geoData, setGeoData] = useState<any>(null);
  //Convert array to object map { "India": 10, "Germany": 4, ... }
  const countryMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const { label, value } of countryData) {
      map[label] = value;
    }
    return map;
  }, [countryData]);
  useEffect(() => {
    fetch("/data/countries.geojson")
      .then((res) => res.json())
      .then(setGeoData);

    // fetch('/api/contracts')
    //   .then(res => res.json())
    //   .then((data: CountryData[]) => {
    //     const map = Object.fromEntries(data.map(d => [d.label, d.value]));
    //     setCountryData(map);
    //   });
  }, []);

  const getColor = (name: string): string => {
    if (!countryMap[name]) return "#ECECEC"; // default fill
    const colors = ["#F64E60", "#8950FC", "#FFA800", "#0BB783", "#6993FF"];
    const index =
      Math.abs(name.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
      colors.length;
    return colors[index];
  };


const onEachCountry = (feature: any, layer: L.Layer) => {
  const name: string = feature.properties?.name;
  const value = countryMap[name];
  const fillColor = getColor(name);

  (layer as L.Path).setStyle({
    fillColor,
    fillOpacity: 1,
    color: 'transparent',
    weight: 0,
  });

  if (value) {
    // ✅ Create tooltip only once
    layer.bindTooltip(`${name}: ${value}`, {
      sticky: true,
      direction: 'top',
      className: "leaflet-tooltip", // Optional custom class
    });

    // ✅ Open on hover
    layer.on('mouseover', function () {
      layer.openTooltip();
    });

    // ✅ Close on leave
    layer.on('mouseout', function () {
      layer.closeTooltip();
    });
  }
};
  if (!geoData) return <p>Loading map...</p>;

  return (
    <div style={{ width: "100%", height: "100%", background: "#ffffff" }}>
      <MapContainer
        center={[20, 0]}
        zoom={1}
        style={{ width: "100%", height: "100%", backgroundColor: "#ffffff" }}
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={false}
      >
        <GeoJSON data={geoData} onEachFeature={onEachCountry} />
      </MapContainer>
    </div>
  );
}
