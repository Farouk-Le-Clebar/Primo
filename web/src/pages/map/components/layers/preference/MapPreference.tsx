import { useMutation } from "@tanstack/react-query";
import { Map, Satellite, Settings, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { changeMapPreference } from "../../../../../requests/UserRequests";

type MapPreferenceProps = {
    onChangeMapType: (type: "basic" | "satellite") => void;
    currentMapType: "basic" | "satellite";
}

const MapPreference = ({ onChangeMapType, currentMapType }: MapPreferenceProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [mapType, setMapType] = useState<"basic" | "satellite">(currentMapType);

    const { mutate: mutateChangeMapPreference, isPending } = useMutation({
        mutationFn: (newMapType: "basic" | "satellite") => changeMapPreference(newMapType),
        onSuccess: (_, newMapType) => {
            onChangeMapType(newMapType);
        },
        onError: (error) => {
            console.error("Error updating map preference:", error);
            setMapType(currentMapType);
        }
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleChangeMapType = (type: "basic" | "satellite") => {
        setMapType(type);
        mutateChangeMapPreference(type);
    }

    return (
        <div
            ref={containerRef}
            className={`absolute z-400 bottom-4 right-4 bg-white rounded-lg shadow-lg transition-all duration-300 overflow-hidden ${isOpen ? "p-2 pb-10" : "w-10 h-10"
                }`}
        >
            <div
                className={`transition-all duration-300 ${isOpen
                        ? "opacity-100"
                        : "opacity-0 h-0 pointer-events-none"
                    }`}
            >
                <p className="text-xs text-gray-500 px-1 mb-1.5 font-medium">Type de carte</p>
                <div className="grid grid-cols-2 gap-1.5">
                    <button
                        disabled={isPending}
                        className={`cursor-pointer flex flex-col items-center p-1.5 rounded border transition-all ${mapType === "basic"
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
                        className={`cursor-pointer flex flex-col items-center p-1.5 rounded border transition-all ${mapType === "satellite"
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

            <button
                className="absolute bottom-2 right-2 w-6 h-6 cursor-pointer group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Settings
                    className={`w-6 h-6 text-gray-700 transition-transform duration-300 ${isOpen ? "rotate-90" : "group-hover:rotate-90"
                        }`}
                />
            </button>
        </div>
    );
};

export default MapPreference;