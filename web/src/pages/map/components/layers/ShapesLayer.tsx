import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { boundToBbox, FRANCE_BBOX, isFeatureCollection, MIN_ZOOM_FOR_CITY, MIN_ZOOM_FOR_DIVISION, MIN_ZOOM_FOR_PARCELLES, style, type DataType } from "../../../../utils/map";
import { GeoJSON, useMap } from "react-leaflet";
import { onEachFeature } from "./ShapesClick";
import { getCityByBbox, getDepartementByBbox, getDivisionsByBboxAndDepartments, getParcellesByBboxAndDepartments } from "../../../../requests/map";
import LoadingPrimoLogo from "../../../../components/animations/LoadingPrimoLogo";

type ShapesLayerProps = {
    onCityBoundChange: (data: any) => void;
    onDepartementsBoundChange: (data: any) => void;
    onDivisionsBoundChange: (data: any) => void;
    onPacellesBoundChange: (data: any) => void;
    mapBounds: L.LatLngBounds | null;
    currentZoom: number;
    dataShape: DataType;
    onParcelleSelect: (bounds: L.LatLngBounds, feature: any, layer: L.Path) => void;
    selectedIdRef: React.RefObject<string | null>;
    initialPlacement: boolean;
};

export const defaultStyle = {
    fillColor: "#54bb8dff",
    color: "#51b789ff",
    fillOpacity: 0.2,
    weight: 2
};

const selectedStyle = {
    fillColor: "#54bb8dff",
    color: "#51b789ff",
    fillOpacity: 0.7,
    weight: 3,
};


const ShapesLayer = ({
    onCityBoundChange,
    onDepartementsBoundChange,
    onDivisionsBoundChange,
    onPacellesBoundChange,
    mapBounds,
    currentZoom,
    dataShape,
    onParcelleSelect,
    selectedIdRef,
    initialPlacement
}: ShapesLayerProps) => {
    const map = useMap();

    // Remplacer isPending par isLoading
    const { data: allDepartements, isLoading: isAllDepartementsLoading } = useQuery({ 
        queryKey: ['allDepartements'],
        queryFn: () => getDepartementByBbox(FRANCE_BBOX),
        staleTime: Infinity,
    });

    useEffect(() => {
        if (allDepartements && isFeatureCollection(allDepartements)) {
            if (!initialPlacement)
                onDepartementsBoundChange(allDepartements);
        }
    }, [allDepartements]);

    const departementsVisibles = useMemo(() => { // Si jamais quelqun lis ceci, en gros cette fonction sert a savoir dans quel département tu es peut importe le niveau de zoom sur la carte et ca permet d'optimiser un maximum les requettes des parcelles / division. Bref gros banger wallah !
        if (!allDepartements?.features || !mapBounds) return [];

        const bounds = mapBounds;

        return allDepartements.features
            .filter((dept: any) => {
                const coords = dept.geometry.coordinates[0][0];
                const lons = coords.map((c: any) => c[0]);
                const lats = coords.map((c: any) => c[1]);
                const deptMinLon = Math.min(...lons);
                const deptMaxLon = Math.max(...lons);
                const deptMinLat = Math.min(...lats);
                const deptMaxLat = Math.max(...lats);

                return !(bounds.getEast() < deptMinLon ||
                    bounds.getWest() > deptMaxLon ||
                    bounds.getNorth() < deptMinLat ||
                    bounds.getSouth() > deptMaxLat);
            })
            .map((dept: any) => dept.properties.ddep_c_cod);
    }, [allDepartements, mapBounds]);

    // Remplacer isPending par isLoading
    const { data: plots, isLoading: isPlotsLoading } = useQuery({
        queryKey: ['initialPlots'],
        queryFn: () => getParcellesByBboxAndDepartments(
            boundToBbox(mapBounds!),
            departementsVisibles
        ),
        staleTime: Infinity,
        enabled: !!mapBounds && departementsVisibles.length > 0 && initialPlacement,
    });

    useEffect(() => {
        if (plots && isFeatureCollection(plots)) {
            onPacellesBoundChange(plots);
            onCityBoundChange(null);
            onDivisionsBoundChange(null);
            onDepartementsBoundChange(null);
        }
    }, [plots]);

    const { mutate: departementsBoundsMutation, isPending: isDepartementsPending } = useMutation({ // Mutation pour récupérer les départements en fonction de la bbox
        mutationFn: () => getDepartementByBbox(boundToBbox(mapBounds!)),
        onSuccess: (data) => {
            if (data && isFeatureCollection(data)) {
                onDepartementsBoundChange(data);
                onCityBoundChange(null);
                onDivisionsBoundChange(null);
                onPacellesBoundChange(null);
            }
        },
        onError: (error) => {
            console.error("Error fetching departements data:", error);
        }
    });

    const { mutate: parcellesBoundsMutation, isPending: isParcellesPending } = useMutation({ // Mutation pour récupérer les parcelles en fonction de la bbox et des départements visibles
        mutationFn: () => getParcellesByBboxAndDepartments(
            boundToBbox(mapBounds!),
            departementsVisibles
        ),
        onSuccess: (data) => {
            if (data && isFeatureCollection(data)) {
                onPacellesBoundChange(data);
                onCityBoundChange(null);
                onDivisionsBoundChange(null);
                onDepartementsBoundChange(null);
            }
        },
        onError: (error) => {
            console.error("Error fetching parcelles data:", error);
        }
    });

    const { mutate: cityBoundsMutation, isPending: isCityPending } = useMutation({ // Mutation pour récupérer les villes en fonction de la bbox
        mutationFn: () => getCityByBbox(boundToBbox(mapBounds!)),
        onSuccess: (data) => {
            if (data && isFeatureCollection(data)) {
                onCityBoundChange(data);
                onPacellesBoundChange(null);
                onDivisionsBoundChange(null);
                onDepartementsBoundChange(null);
            }
        },
        onError: (error) => {
            console.error("Error fetching city data:", error);
        }
    });

    const { mutate: divisionsBoundsMutation, isPending: isDivisionsPending } = useMutation({ // Mutation pour récupérer les divisions en fonction de la bbox et des départements visibles
        mutationFn: () => getDivisionsByBboxAndDepartments(
            boundToBbox(mapBounds!),
            departementsVisibles
        ),
        onSuccess: (data) => {
            if (data && isFeatureCollection(data)) {
                onDivisionsBoundChange(data);
                onPacellesBoundChange(null);
                onCityBoundChange(null);
                onDepartementsBoundChange(null);
            }
        },
        onError: (error) => {
            console.error("Error fetching divisions data:", error);
        }
    });

    useEffect(() => { // La c'est le useEffect qui en gros vérifie a quel niveau de zoom on est et dcp il sais keski fo requetter  ex: niveau 6 c les départements ta capté ?
        if (mapBounds &&
            currentZoom >= MIN_ZOOM_FOR_PARCELLES &&
            departementsVisibles.length > 0) {
            parcellesBoundsMutation();
        }

        if (mapBounds &&
            currentZoom >= MIN_ZOOM_FOR_CITY &&
            currentZoom < MIN_ZOOM_FOR_DIVISION
        ) {
            cityBoundsMutation();
        }

        if (mapBounds &&
            currentZoom >= MIN_ZOOM_FOR_DIVISION &&
            currentZoom < MIN_ZOOM_FOR_PARCELLES &&
            departementsVisibles.length > 0
        ) {
            divisionsBoundsMutation();
        }

        if (mapBounds &&
            currentZoom < MIN_ZOOM_FOR_CITY
        ) {
            departementsBoundsMutation();
        }
    }, [mapBounds, currentZoom]);

    return (
        <>
            {/* Utiliser les nouvelles variables Loading pour les query, et garder Pending pour les mutations */}
            {(isPlotsLoading || isAllDepartementsLoading || isCityPending || isDepartementsPending) && (
                <div className="absolute top-0 left-0 w-full h-full bg-white/20 backdrop-blur-sm z-[400] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <LoadingPrimoLogo className="w-20 h-20" />
                        <span className="text-black text-lg">Chargement des données...</span>
                    </div>
                </div>
            )}
            {dataShape.departements && ( // Layer GeoJSON pour les départements
                <GeoJSON
                    key={JSON.stringify(dataShape.departements)}
                    data={dataShape.departements}
                    style={style}
                    onEachFeature={(feature, layer) => onEachFeature(feature, layer, map, onParcelleSelect)}
                />
            )}
            {dataShape.parcelles && ( // La meme pour les parcelles
                <GeoJSON
                    key={JSON.stringify(dataShape.parcelles)}
                    data={dataShape.parcelles}
                    style={(feature) => {
                        const id = feature?.id;
                        return id === selectedIdRef.current ? selectedStyle : defaultStyle;
                    }}
                    onEachFeature={(feature, layer) => onEachFeature(feature, layer, map, onParcelleSelect, selectedIdRef)}
                />
            )}
            {dataShape.city && ( // La meme pour les city
                <GeoJSON
                    key={JSON.stringify(dataShape.city)}
                    data={dataShape.city}
                    style={style}
                    onEachFeature={(feature, layer) => onEachFeature(feature, layer, map, onParcelleSelect)}
                />
            )}
            {dataShape.divisions && ( // Et ta capté la meme pour les section cadastrale
                <GeoJSON
                    key={JSON.stringify(dataShape.divisions)}
                    data={dataShape.divisions}
                    style={style}
                    onEachFeature={(feature, layer) => onEachFeature(feature, layer, map, onParcelleSelect)}
                />
            )}
        </>
    );
};

export default ShapesLayer; // Ya presque tout qui est opti aux petits oignons ici, jsuis plutot content en sah

// NOTE A MOI MEME POUR PLUS TARD : Changer le layer des villes, pour avoir un layer de ville par département et faire comme pour les parcelles et les division (car la requette des villes est un peu plus longue que les autres a cause des 400 Mo et quelques du layer niveau france)
// Si vous avez des question contactez moi sur discord l'ekip pseudo : xeroce
// Jak sap1 si tu lis ca me contact pas je t'aime pas salo
// ACAB / Nik la polisse