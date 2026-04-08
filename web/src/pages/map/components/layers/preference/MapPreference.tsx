import { useMutation } from "@tanstack/react-query";
import { Map, Satellite, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { changeMapPreference } from "../../../../../requests/UserRequests";

type MapPreferenceProps = {
    isOpen: boolean;
    onChangeMapType: (type: "basic" | "satellite") => void;
    currentMapType: "basic" | "satellite";
};

const MapPreference = ({ isOpen, onChangeMapType, currentMapType }: MapPreferenceProps) => {
    const [mapType, setMapType] = useState<"basic" | "satellite">(currentMapType);

    // Maintient la synchro si le type de carte est changé ailleurs
    useEffect(() => {
        setMapType(currentMapType);
    }, [currentMapType]);

    const { mutate: mutateChangeMapPreference, isPending } = useMutation({
        mutationFn: (newMapType: "basic" | "satellite") => changeMapPreference(newMapType),
        onSuccess: (_, newMapType) => {
            onChangeMapType(newMapType);
        },
        onError: (error) => {
            console.error("Error updating map preference:", error);
            setMapType(currentMapType); // Rollback en cas d'erreur
        }
    });

    const handleChangeMapType = (type: "basic" | "satellite") => {
        if (type === mapType) return;
        setMapType(type);
        mutateChangeMapPreference(type);
    };

    return (
        <div
            className={`bg-white rounded-lg shadow-lg border border-gray-100 p-2 w-44 transition-all duration-300 origin-right ${
                isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
            }`}
        >
            <p className="text-xs text-gray-500 px-1 mb-1.5 font-medium">Type de fond de plan</p>
            <div className="grid grid-cols-2 gap-1.5">
                <button
                    disabled={isPending}
                    className={`cursor-pointer flex flex-col items-center p-1.5 rounded border transition-all ${
                        mapType === "basic"
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                    } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleChangeMapType("basic")}
                >
                    {isPending && mapType === "basic" ? (
                        <Loader2 className="w-5 h-5 mb-0.5 text-green-600 animate-spin" />
                    ) : (
                        <Map className={`w-5 h-5 mb-0.5 ${mapType === "basic" ? "text-green-600" : "text-gray-500"}`} />
                    )}
                    <span className={`text-[10px] font-medium ${mapType === "basic" ? "text-green-600" : "text-gray-600"}`}>
                        Carte
                    </span>
                </button>

                <button
                    disabled={isPending}
                    className={`cursor-pointer flex flex-col items-center p-1.5 rounded border transition-all ${
                        mapType === "satellite"
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                    } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleChangeMapType("satellite")}
                >
                    {isPending && mapType === "satellite" ? (
                        <Loader2 className="w-5 h-5 mb-0.5 text-green-600 animate-spin" />
                    ) : (
                        <Satellite className={`w-5 h-5 mb-0.5 ${mapType === "satellite" ? "text-green-600" : "text-gray-500"}`} />
                    )}
                    <span className={`text-[10px] font-medium ${mapType === "satellite" ? "text-green-600" : "text-gray-600"}`}>
                        Satellite
                    </span>
                </button>
            </div>
        </div>
    );
};

export default MapPreference;