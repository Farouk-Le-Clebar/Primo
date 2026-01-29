import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Layers from './components/Layers';

const Map = () => {

  return (
    <div className="h-screen w-screen">
      <MapContainer
          center={[46.603354, 1.888334]}
          zoom={6}
          className="h-full w-full"
          attributionControl={false}
          preferCanvas={true}
          zoomControl={false}
          >
          <Layers />
      </MapContainer>
    </div>
  );
};

export default Map;