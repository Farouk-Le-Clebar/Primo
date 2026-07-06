import { useMutation } from "@tanstack/react-query";
import { Map, Satellite, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { changeMapPreference } from "../../../../../requests/UserRequests";

type MapPreferenceProps = {
    isOpen: boolean;
    onChangeMapType: (type: "basic" | "satellite" | "basic-dark") => void;
    currentMapType: "basic" | "satellite" | "basic-dark";
};

const MapPreference = ({ isOpen, onChangeMapType, currentMapType }: MapPreferenceProps) => {
    const [mapType, setMapType] = useState<"basic" | "satellite" | "basic-dark">(currentMapType);

    useEffect(() => {
        setMapType(currentMapType);
    }, [currentMapType]);

    const { mutate: mutateChangeMapPreference, isPending } = useMutation({
        mutationFn: (newMapType: "basic" | "satellite" | "basic-dark") => changeMapPreference(newMapType),
        onSuccess: (_, newMapType) => {
            onChangeMapType(newMapType);
        },
        onError: (error) => {
            console.error("Error updating map preference:", error);
            setMapType(currentMapType);
        }
    });

    const handleChangeMapType = (type: "basic" | "satellite" | "basic-dark") => {
        if (type === mapType) return;
        setMapType(type);
        mutateChangeMapPreference(type);
    };

    return (
        <div
            className={`bg-white dark:bg-[#0A0A0A] rounded-lg shadow-lg border border-gray-100 dark:border-white/10 p-2 w-44 transition-all duration-300 origin-right ${
                isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
            }`}
        >
            <p className="text-xs text-gray-500 dark:text-gray-400 px-1 mb-1.5 font-medium">Type de fond de plan</p>
            <div className="grid grid-cols-2 gap-1.5">
                <button
                    disabled={isPending}
                    className={`cursor-pointer flex flex-col items-center p-1.5 rounded border transition-all ${
                        mapType === "basic"
                            ? "border-blue-600 bg-blue-50 dark:border-blue-500/50 dark:bg-blue-500/10"
                            : "border-gray-200 hover:border-gray-300 dark:border-white/5 dark:bg-[#111111]/50 dark:hover:bg-white/5 dark:hover:border-white/10"
                    } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleChangeMapType("basic")}
                >
                    {isPending && mapType === "basic" ? (
                        <Loader2 className="w-5 h-5 mb-0.5 text-blue-600 dark:text-blue-400 animate-spin" />
                    ) : (
                        <Map className={`w-5 h-5 mb-0.5 ${mapType === "basic" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`} />
                    )}
                    <span className={`text-[10px] font-medium ${mapType === "basic" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"}`}>
                        Carte
                    </span>
                </button>

                <button
                    disabled={isPending}
                    className={`cursor-pointer flex flex-col items-center p-1.5 rounded border transition-all ${
                        mapType === "satellite"
                            ? "border-blue-600 bg-blue-50 dark:border-blue-500/50 dark:bg-blue-500/10"
                            : "border-gray-200 hover:border-gray-300 dark:border-white/5 dark:bg-[#111111]/50 dark:hover:bg-white/5 dark:hover:border-white/10"
                    } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleChangeMapType("satellite")}
                >
                    {isPending && mapType === "satellite" ? (
                        <Loader2 className="w-5 h-5 mb-0.5 text-blue-600 dark:text-blue-400 animate-spin" />
                    ) : (
                        <Satellite className={`w-5 h-5 mb-0.5 ${mapType === "satellite" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`} />
                    )}
                    <span className={`text-[10px] font-medium ${mapType === "satellite" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"}`}>
                        Satellite
                    </span>
                </button>
            </div>
        </div>
    );
};

export default MapPreference;