import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import InfoLayer from '../../components/ParcelPanel/ParcelInfoPanel';
import Layers from './components/Layers';
import SearchController from './components/SearchController';
import { ParcelleProvider } from '../../context/ParcelleContext';

const Map = () => {

  return (
    <ParcelleProvider>
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
          <SearchController />
        </MapContainer>
        <InfoLayer isVisible={true} />
      </div>
    </ParcelleProvider>
  );
};

export default Map;