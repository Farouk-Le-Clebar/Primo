import { MapPin, Maximize, Hash, Landmark, FileText } from "lucide-react";

interface ParcelProperties {
  nom_com: string;
  section: string;
  numero: string;
  contenance: number;
  idu: string;
  code_insee: string;
  code_dep: string;
}

export const ParcelInfoCard = ({ properties }: { properties: ParcelProperties }) => {
  if (!properties) return null;

  // Formatage de la surface
  const formatSurface = (m2: number) => {
    if (m2 >= 10000) {
      return `${(m2 / 10000).toFixed(2)} ha`;
    }
    return `${m2.toLocaleString('fr-FR')} m²`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
      {/* Header : Ville et Section */}
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
        
        <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">
          {properties.nom_com}
        </h3>
        <p className="text-gray-500 text-sm font-medium mt-1">
          Parcelle n° <span className="text-gray-900">{properties.numero}</span>
        </p>
      </div>

      {/* Grille d'infos clés */}
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
            <Landmark size={12} /> Code INSEE
          </span>
          <span className="text-sm font-semibold text-gray-800">
            {properties.code_insee} ({properties.code_dep})
          </span>
        </div>
      </div>

      {/* Identifiant Unique (IDU) */}
      <div className="bg-gray-50/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={12} className="text-gray-400" />
          <span className="text-[10px] font-bold text-gray-400 uppercase">Référence</span>
        </div>
        <code className="text-[10px] font-mono font-medium text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm select-all">
          {properties.idu}
        </code>
      </div>
    </div>
  );
};