import { useMap } from "react-leaflet";

type ModalRedirectAiCoordinatesProps = {
    coordinates: string;
    onClose: () => void;
}

const ModalRedirectAiCoordinates = ({ coordinates, onClose }: ModalRedirectAiCoordinatesProps) => {
    const coordsObj = JSON.parse(coordinates);
    const map = useMap();

    const handleRedirect = () => {
        map.flyTo([coordsObj.lat, coordsObj.lon], 18, {
            duration: 2
        });
        onClose();
    }

    return (
        <div className="font-UberMove text-gray-800 fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Redirection</h2>
                <p className="mb-4 text-sm">
                    L'IA Primo souhaite vous rediriger vers <span className="font-semibold">{coordsObj.name || "ces coordonnées"}</span>
                </p>

                <div className="flex justify-end">
                    <button
                        className="cursor-pointer px-4 py-2 bg-[#388160] text-white rounded-lg hover:bg-[#2a6b4a] transition-colors duration-200"
                        onClick={handleRedirect}
                    >
                        Accepter
                    </button>
                    <button
                        className="cursor-pointer ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                        onClick={onClose}
                    >
                        Refuser
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalRedirectAiCoordinates;