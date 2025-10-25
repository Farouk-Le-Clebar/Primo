import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  FRANCE_BOUNDS,
  ZOOM_THRESHOLDS,
  MAP_CONFIG,
  TILE_URLS,
  LAYER_STYLES,
  LAYER_LABELS,
  HOVER_STYLES,
  FIT_BOUNDS_OPTIONS,
  DEPARTEMENT_CENTERS,
} from "../../constants/map.constants";
import type {
  ZoomLevel,
  GeoJSONData,
  ParcelMapProps,
} from "../../types/map.types";
import {
  fetchDepartements,
  fetchCommunes,
  fetchDivisions,
  fetchParcelles,
} from "../../request/parcel-map";
import { boundsToPolygon } from "../../utils/map.utils";
import SearchBar from "../search/SearchBar";

const ParcelMap = ({
  darkMode = false,
  center = MAP_CONFIG.DEFAULT_CENTER,
  zoom = MAP_CONFIG.DEFAULT_ZOOM,
  showSearchBar = false,
}: ParcelMapProps) => {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData | null>(null);
  const [currentLevel, setCurrentLevel] = useState<ZoomLevel>("departements");
  const [displayedLevel, setDisplayedLevel] =
    useState<ZoomLevel>("departements");
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );
  const [markerLabel, setMarkerLabel] = useState<string>("");
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const tileUrl = darkMode ? TILE_URLS.DARK : TILE_URLS.LIGHT;

  const currentStyle = useMemo(
    () => LAYER_STYLES[displayedLevel],
    [displayedLevel]
  );

  const customIcon = useMemo(() => {
    return L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }, []);

  const handleAddressSelect = useCallback(
    (coords: [number, number], label?: string) => {
      if (mapRef.current) {
        setMarkerPosition(coords);
        setMarkerLabel(label || "Adresse sélectionnée");
        mapRef.current.setView(coords, 18, {
          animate: true,
          duration: 1,
        });
      }
    },
    []
  );

  const getDepartementsInView = useCallback(
    (bounds: L.LatLngBounds): string[] => {
      const visibleDepts: string[] = [];

      for (const [code, center] of Object.entries(DEPARTEMENT_CENTERS)) {
        const [lat, lng] = center;
        if (
          bounds.contains([lat, lng]) ||
          bounds.pad(0.5).contains([lat, lng])
        ) {
          visibleDepts.push(code);
        }
      }

      if (visibleDepts.length === 0) {
        const center = bounds.getCenter();
        const sorted = Object.entries(DEPARTEMENT_CENTERS)
          .map(([code, [lat, lng]]) => ({
            code,
            distance: Math.sqrt(
              Math.pow(center.lat - lat, 2) + Math.pow(center.lng - lng, 2)
            ),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);

        return sorted.map((d) => d.code);
      }

      return visibleDepts;
    },
    []
  );

  const loadAllDepartements = useCallback(async () => {
    try {
      const data = await fetchDepartements();
      setGeoJsonData(data);
      setDisplayedLevel("departements");
    } catch (err) {
      console.error("Failed to fetch departements data:", err);
    }
  }, []);

  const loadCommunes = useCallback(
    async (bounds: L.LatLngBounds) => {
      try {
        const departementsToLoad = getDepartementsInView(bounds);

        const promises = departementsToLoad.map((code) => fetchCommunes(code));

        const results = await Promise.all(promises);

        const allFeatures: any[] = [];
        results.forEach((data) => {
          if (data.type === "FeatureCollection") {
            allFeatures.push(...data.features);
          } else if (data.type === "Feature") {
            allFeatures.push(data);
          }
        });

        setGeoJsonData({
          type: "FeatureCollection",
          features: allFeatures,
        });
        setDisplayedLevel("communes");
      } catch (err) {
        console.error("Failed to fetch communes data:", err);
      }
    },
    [getDepartementsInView]
  );

  const loadDivisions = useCallback(async (bounds: L.LatLngBounds) => {
    try {
      const polygon = boundsToPolygon(bounds);
      const data = await fetchDivisions(polygon);
      setGeoJsonData(data);
      setDisplayedLevel("divisions");
    } catch (err) {
      console.error("Failed to fetch divisions data:", err);
    }
  }, []);

  const loadParcelles = useCallback(async (bounds: L.LatLngBounds) => {
    try {
      const polygon = boundsToPolygon(bounds);
      const data = await fetchParcelles(polygon);
      setGeoJsonData(data);
      setDisplayedLevel("parcelles");
    } catch (err) {
      console.error("Failed to fetch parcelles data:", err);
    }
  }, []);

  useEffect(() => {
    let newLevel: ZoomLevel;

    if (currentZoom <= ZOOM_THRESHOLDS.DEPARTEMENTS_MAX) {
      newLevel = "departements";
    } else if (currentZoom <= ZOOM_THRESHOLDS.COMMUNES_MAX) {
      newLevel = "communes";
    } else if (currentZoom <= ZOOM_THRESHOLDS.DIVISIONS_MAX) {
      newLevel = "divisions";
    } else {
      newLevel = "parcelles";
    }

    if (newLevel !== currentLevel) {
      setCurrentLevel(newLevel);
    }
  }, [currentZoom, currentLevel]);

  useEffect(() => {
    if (!mapBounds) return;

    if (currentLevel === "departements") {
      loadAllDepartements();
    } else if (currentLevel === "communes") {
      loadCommunes(mapBounds);
    } else if (currentLevel === "divisions") {
      loadDivisions(mapBounds);
    } else if (currentLevel === "parcelles") {
      loadParcelles(mapBounds);
    }
  }, [currentLevel, refreshTrigger]);

  const MapEvents = () => {
    const map = useMapEvents({
      zoomend(e) {
        const z = e.target.getZoom();
        setCurrentZoom(z);
        const bounds = e.target.getBounds();
        setMapBounds(bounds);
        setRefreshTrigger((prev) => prev + 1);
      },
      moveend(e) {
        const bounds = e.target.getBounds();
        setMapBounds(bounds);
        setRefreshTrigger((prev) => prev + 1);
      },
    });

    useEffect(() => {
      if (map) {
        mapRef.current = map;
        if (!mapBounds) {
          const bounds = map.getBounds();
          const z = map.getZoom();
          setMapBounds(bounds);
          setCurrentZoom(z);
          setRefreshTrigger((prev) => prev + 1);
        }
      }
    }, [map, mapBounds]);

    return null;
  };

  return (
    <div className="h-130 w-full rounded-lg shadow-lg relative">
      {showSearchBar && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-96 z-[1000]">
          <SearchBar onAddressSelect={handleAddressSelect} />
        </div>
      )}
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full rounded-lg"
        maxBounds={FRANCE_BOUNDS}
        minZoom={MAP_CONFIG.MIN_ZOOM}
        maxZoom={MAP_CONFIG.MAX_ZOOM}
      >
        <TileLayer url={tileUrl} />
        <MapEvents />

        {markerPosition && (
          <Marker position={markerPosition} icon={customIcon}>
            <Popup>
              <div style={{ fontFamily: "sans-serif" }}>
                <strong>{markerLabel}</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {geoJsonData && (
          <GeoJSON
            key={`${displayedLevel}-${refreshTrigger}`}
            data={geoJsonData as any}
            ref={geoJsonLayerRef as any}
            style={() => currentStyle}
            onEachFeature={(feature, layer) => {
              const props = feature.properties || {};

              const name =
                props.nom ||
                props.nom_departement ||
                props.nom_commune ||
                props.numero ||
                props.id ||
                props.libelle ||
                "Inconnu";

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
        )}
      </MapContainer>
    </div>
  );
};

export default ParcelMap;
