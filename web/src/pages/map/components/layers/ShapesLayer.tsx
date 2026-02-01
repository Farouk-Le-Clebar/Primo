import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { boundToBbox, FRANCE_BBOX, isFeatureCollection, MIN_ZOOM_FOR_CITY, MIN_ZOOM_FOR_DIVISION, MIN_ZOOM_FOR_PARCELLES, style, type DataType } from "../../../../utils/map";
import { GeoJSON, useMap } from "react-leaflet";
import { onEachFeature } from "./ShapesClick";
import { getCityByBbox, getDepartementByBbox, getDivisionsByBboxAndDepartments, getParcellesByBboxAndDepartments } from "../../../../requests/map";

type ShapesLayerProps = {
    onCityBoundChange: (data: any) => void;
    onDepartementsBoundChange: (data: any) => void;
    onDivisionsBoundChange: (data: any) => void;
    onPacellesBoundChange: (data: any) => void;
    mapBounds: L.LatLngBounds | null;
    currentZoom: number;
    dataShape: DataType;
    onParcelleSelect: (bounds: L.LatLngBounds, feature: any, layer: L.Path) => void;
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
}: ShapesLayerProps) => {
    const map = useMap();

    const { data: allDepartements } = useQuery({ // Ici l'ékip ya une requette initiale qui charge et garde en cache les départements de toute la france pour pouvoir faire des check de visibilité plus tard
        queryKey: ['allDepartements'],
        queryFn: () => getDepartementByBbox(FRANCE_BBOX),
        staleTime: Infinity,
    });

    useEffect(() => {
        if (allDepartements && isFeatureCollection(allDepartements)) {
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

    const { mutate: departementsBoundsMutation } = useMutation({ // Mutation pour récupérer les départements en fonction de la bbox
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

    const { mutate: parcellesBoundsMutation } = useMutation({ // Mutation pour récupérer les parcelles en fonction de la bbox et des départements visibles
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

    const { mutate: cityBoundsMutation } = useMutation({ // Mutation pour récupérer les villes en fonction de la bbox
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

    const { mutate: divisionsBoundsMutation } = useMutation({ // Mutation pour récupérer les divisions en fonction de la bbox et des départements visibles
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
                    style={style}
                    onEachFeature={(feature, layer) => onEachFeature(feature, layer, map, onParcelleSelect)}
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