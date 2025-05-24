"use client";

import { MapContainer, GeoJSON } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { scaleLinear } from "d3-scale";

type CityData = { label: string; value: number };
interface IranMapProps {
  cityData: CityData[];
}

export default function IranMap({ cityData }: IranMapProps) {
  const [geoData, setGeoData] = useState<any>(null);

  const cityMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const { label, value } of cityData) {
      map[label] = value;
    }
    return map;
  }, [cityData]);

  useEffect(() => {
    fetch("/data/iran.json") // your Iran GeoJSON file here
      .then((res) => res.json())
      .then(setGeoData);
  }, []);

  // Create a color scale from min 0 to max city value
  const maxValue = Math.max(...cityData.map((d) => d.value), 0);
  const colorScale = scaleLinear<string>()
    .domain([0, maxValue || 1])
    .range(["#FFEDA0", "#F03B20"]);

  const getColor = (value: number | undefined) => {
    if (value === undefined) return "#ECECEC";
    return colorScale(value);
  };

  const onEachCity = (feature: any, layer: L.Layer) => {
    // const name: string = feature.properties?.name;
    const name = feature.properties?.NAME_1;

    const value = cityMap[name];
    const fillColor = getColor(value);

    (layer as L.Path).setStyle({
      fillColor,
      fillOpacity: 1,
      color: "transparent",
      weight: 0,
    });

    if (value !== undefined) {
      layer.bindTooltip(`${name}: %${value}`, {
        sticky: true,
        direction: "top",
        className: "leaflet-tooltip",
      });

      layer.on("mouseover", () => layer.openTooltip());
      layer.on("mouseout", () => layer.closeTooltip());
    }
  };

  if (!geoData) return <p>Loading map...</p>;

  return (
    <div style={{ width: "100%", height: "100%", background: "#fff" }}>
      <MapContainer
        center={[32.0, 53.0]}
        zoom={5}
        style={{ width: "100%", height: "100%", background: "#fff" }}
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={false}
      >
        <GeoJSON data={geoData} onEachFeature={onEachCity} />
      </MapContainer>
    </div>
  );
}
