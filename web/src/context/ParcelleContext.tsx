import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import L from 'leaflet';

interface ParcelleData {
  bounds: L.LatLngBounds | null;
  feature: any | null;
  layer: L.Path | null;
}

interface ParcelleContextType {
  selectedParcelle: ParcelleData;
  setSelectedParcelle: (data: ParcelleData) => void;
  clearSelectedParcelle: () => void;
}

const ParcelleContext = createContext<ParcelleContextType | undefined>(undefined);

export const ParcelleProvider = ({ children }: { children: ReactNode }) => {
  const [selectedParcelle, setSelectedParcelleState] = useState<ParcelleData>({
    bounds: null,
    feature: null,
    layer: null
  });

  const setSelectedParcelle = (data: ParcelleData) => {
    setSelectedParcelleState(data);
  };

  const clearSelectedParcelle = () => {
    setSelectedParcelleState({
      bounds: null,
      feature: null,
      layer: null
    });
  };

  return (
    <ParcelleContext.Provider value={{ selectedParcelle, setSelectedParcelle, clearSelectedParcelle }}>
      {children}
    </ParcelleContext.Provider>
  );
};

export const useParcelle = () => {
  const context = useContext(ParcelleContext);
  if (context === undefined) {
    throw new Error('useParcelle must be used within a ParcelleProvider');
  }
  return context;
};