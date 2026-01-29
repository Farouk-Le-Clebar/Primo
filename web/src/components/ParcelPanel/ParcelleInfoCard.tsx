import { MapPin, Maximize, Landmark, FileText, Calendar } from "lucide-react";

interface ParcelProperties {
  id: string;
  commune: string;
  section: string;
  numero: string;
  contenance: number;
  prefixe?: string;
  updated?: string;
  created?: string;
}

export const ParcelInfoCard = ({ properties }: { properties: ParcelProperties }) => {
  if (!properties) return null;

  const code_dep = properties.commune?.substring(0, 2);

  const formatSurface = (m2: number) => {
    if (m2 >= 10000) {
      return `${(m2 / 10000).toFixed(2)} ha`;
    }
    return `${m2.toLocaleString('fr-FR')} m²`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/C";
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
      {/* Header : Section et Numéro */}
      <div className="p-5 border-b border-gray-50 bg-gradient-to-r from-white to-gray-50/50">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 text-green-600">
            <MapPin size={16} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase tracking-wider">Localisation</span>
          </div>
          <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-tighter shadow-sm">
            SECTION {properties.section}
          </span>
        </div>
        
        <p className="text-gray-500 text-sm font-medium mt-1">
          Parcelle n° <span className="text-gray-900">{properties.numero}</span> 
          {properties.prefixe && properties.prefixe !== "000" && (
            <span className="ml-1 text-gray-400 text-xs">(prefixe {properties.prefixe})</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 border-b border-gray-100">
        <div className="p-4 border-r border-gray-100 flex flex-col">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            <Maximize size={12} /> Surface
          </span>
          <span className="text-sm font-semibold text-gray-800">
            {formatSurface(properties.contenance)}
          </span>
        </div>
        <div className="p-4 flex flex-col">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            <Landmark size={12} /> Département
          </span>
          <span className="text-sm font-semibold text-gray-800">
             INSEE {properties.commune} ({code_dep})
          </span>
        </div>
      </div>

      <div className="bg-gray-50/50 px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <FileText size={12} className="text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Référence Cadastrale</span>
            </div>
            <code className="text-[10px] font-mono font-medium text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm select-all">
                {properties.id}
            </code>
        </div>
        
        {properties.updated && (
            <div className="flex items-center gap-2 pt-1 border-t border-gray-200/50">
                <Calendar size={12} className="text-gray-400" />
                <span className="text-[10px] text-gray-400">
                    Mis à jour le : <span className="font-medium">{formatDate(properties.updated)}</span>
                </span>
            </div>
        )}
      </div>
    </div>
  );
};