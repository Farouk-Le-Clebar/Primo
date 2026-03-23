import { X, MapPin } from "lucide-react";

type ParcelPanelHeaderProps = {
  parcelId: string;
  onClose: () => void;
};

export function ParcelPanelHeader({ parcelId, onClose }: ParcelPanelHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="bg-green-600 p-2 rounded-lg text-white shadow-md shadow-green-200">
          <MapPin size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 leading-tight">Détails Parcelle</h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">{parcelId}</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Fermer le panneau"
      >
        <X size={24} />
      </button>
    </div>
  );
}