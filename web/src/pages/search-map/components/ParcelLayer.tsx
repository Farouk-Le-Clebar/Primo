import { GeoJSON } from "react-leaflet";
import { useRef, useMemo } from "react";
import L from "leaflet";
import {
  LAYER_STYLES,
  LAYER_LABELS,
  HOVER_STYLES,
  FIT_BOUNDS_OPTIONS,
} from "../../../constants/map.constants";
import type { ParcelLayerProps } from "../../../types/map.types";

const ParcelLayer = ({
  geoJsonData,
  displayedLevel,
  refreshTrigger,
  mapRef,
}: ParcelLayerProps) => {
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  const currentStyle = useMemo(
    () => LAYER_STYLES[displayedLevel],
    [displayedLevel]
  );

  if (!geoJsonData) return null;

  return (
    <GeoJSON
      key={`${displayedLevel}-${refreshTrigger}`}
      data={geoJsonData as any}
      ref={geoJsonLayerRef as any}
      style={() => currentStyle}
      onEachFeature={(feature, layer) => {
        const props = feature.properties || {};

        // Extract name from various possible properties
        const name =
          props.nom ||
          props.nom_departement ||
          props.nom_commune ||
          props.numero ||
          props.id ||
          props.libelle ||
          "Inconnu";

        // Build popup HTML content
        const popupContent = `
          <div style="font-family: sans-serif; min-width: 180px;">
            <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 14px;">${name}</h3>
            <p style="margin: 0; color: #7f8c8d; font-size: 11px;">${
              LAYER_LABELS[displayedLevel]
            }</p>
            ${
              props.code || props.code_insee
                ? `<p style="margin: 4px 0 0 0; font-size: 10px;"><strong>Code:</strong> ${
                    props.code || props.code_insee
                  }</p>`
                : ""
            }
            ${
              props.population
                ? `<p style="margin: 2px 0 0 0; font-size: 10px;"><strong>Population:</strong> ${props.population.toLocaleString()}</p>`
                : ""
            }
            ${
              props.surface
                ? `<p style="margin: 2px 0 0 0; font-size: 10px;"><strong>Surface:</strong> ${props.surface} m²</p>`
                : ""
            }
          </div>
        `;
        layer.bindPopup(popupContent);

        // Add interactions: click to zoom, hover effects
        layer.on({
          click: (e) => {
            const bounds = e.target.getBounds();

            if (mapRef.current) {
              mapRef.current.fitBounds(bounds, FIT_BOUNDS_OPTIONS);
            }
          },
          mouseover: (e) => {
            e.target.setStyle({
              weight: currentStyle.weight + HOVER_STYLES.WEIGHT_INCREASE,
              fillOpacity: HOVER_STYLES.FILL_OPACITY,
            });
          },
          mouseout: (e) => {
            e.target.setStyle({
              weight: currentStyle.weight,
              fillOpacity: currentStyle.fillOpacity,
            });
          },
        });
      }}
    />
  );
};

export default ParcelLayer;
