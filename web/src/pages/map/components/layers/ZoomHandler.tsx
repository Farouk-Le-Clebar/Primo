import { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';

type ZoomHandlerProps = {
  onZoomChange: (zoom: number) => void;
};

const ZoomHandler = ({ onZoomChange }: ZoomHandlerProps) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });

  useEffect(() => {
    onZoomChange(map.getZoom());
  }, []);

  return null;
};

export default ZoomHandler;