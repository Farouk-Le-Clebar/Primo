import { useMap } from "react-leaflet";
import SearchBar from "../../../components/search/SearchBar";

const SearchController = () => {
    const map = useMap();

    const handleAdressSelect = (coords: [number, number]) => {
        map.flyTo(coords, 18, { duration: 1.5 });
    };

    return (
        <div className="absolute top-5 left-0 w-full z-[1000] flex justify-center pointer-events-none">
            <div className="w-1/2 pointer-events-auto">
                <SearchBar
                    onAdressSelect={handleAdressSelect}
                />
            </div>
        </div>
    );
}

export default SearchController;