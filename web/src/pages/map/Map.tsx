import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Layers from './components/Layers';
import { useSearchParams } from 'react-router-dom';

const Map = () => {
  const [searchParams] = useSearchParams();
  const coo_x = searchParams.get('coo_x');
  const coo_y = searchParams.get('coo_y');

  const center: [number, number] = (coo_x && coo_y) ? [parseFloat(coo_y), parseFloat(coo_x)] : [46.603354, 1.888334];
  const zoom = (coo_x && coo_y) ? 18 : 6;
  return (
    <div className="h-screen w-screen relative">
      <MapContainer
        center={center}
        zoom={zoom}
        className="absolute top-[56px] left-0 right-0 bottom-0"
        attributionControl={false}
        preferCanvas={true}
        zoomControl={false}
      >
        <Layers initialPlacement={!!(coo_x && coo_y)} />
      </MapContainer>
    </div>
  );
};

export default Map;