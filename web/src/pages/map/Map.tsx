import { MapContainer } from 'react-leaflet';
import Layers from './components/Layers';
import { useSearchParams } from 'react-router-dom';

const Map = () => {
  const [searchParams] = useSearchParams();
  const coo_x = searchParams.get('coo_x');
  const coo_y = searchParams.get('coo_y');

  const center: [number, number] = (coo_x && coo_y) ? [parseFloat(coo_y), parseFloat(coo_x)] : [43.6114, 1.4299];
  const zoom = (coo_x && coo_y) ? 18 : 16;


  return (
    <div className="h-screen w-screen relative">
      <MapContainer
        center={center}
        zoom={zoom}
        className="absolute inset-0"
        attributionControl={false}
        preferCanvas={true}
        zoomControl={false}
      >
        <Layers initialPlacement={!!(coo_x && coo_y)} initialCoordinates={center} />
      </MapContainer>
    </div>
  );
};

export default Map;