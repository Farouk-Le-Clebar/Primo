import { useMap } from "react-leaflet";
import SearchBar from "../../../components/search/SearchBar";

const SearchController = () => {
    const map = useMap();

    const handleAdressSelect = (coords: [number, number]) => {
        map.flyTo(coords, 18, { duration: 1.5 });
    };

    return (
        <div className="absolute top-5 left-0 z-1000 w-full flex justify-center">
            <SearchBar
                onAddressSelect={handleAdressSelect}
            />
        </div>
    );
}

export default SearchController;