
import { BuildingThumbnail } from "./BuildingThumbnail";
import { Building2, Ruler, Layers, Calendar,Home, Briefcase, Warehouse, ArrowUpFromLine, Hash } from "lucide-react";

const getBuildingIcon = (usage: string) => {
    if (!usage) return <Building2 className="text-gray-400" size={16} />;
    const buildingType = usage.toLowerCase();
  
    if (buildingType.includes("résidentiel")) 
      return <Home className="text-emerald-600" size={16} />;

    if (buildingType.includes("commercial") || buildingType.includes("service")) 
      return <Briefcase className="text-blue-600" size={16} />;
  
    if (buildingType.includes("industriel")) 
      return <Warehouse className="text-amber-600" size={16} />;

    return <Building2 className="text-gray-400" size={16} />;
};

export const BuildingCard = ({ p, building, matMur, matToit, constructionYear }: any) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden mb-4 last:mb-0">
    <div className="p-4 flex gap-4">
      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
        <BuildingThumbnail feature={building} />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {p.nature || "BATIMENT"}
            </span>
            {p.etat && p.etat !== "En service" && (
              <span className="bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {p.etat}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getBuildingIcon(p.usage1)}
            <h4 className="font-bold text-gray-900 text-base truncate leading-tight" title={p.usage1}>
              {p.usage1 || "Usage non défini"}
            </h4>
          </div>
        </div>
      </div>
    </div>

    <div className="px-4 pb-4">
      <div className="grid grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-lg overflow-hidden">
        <MetricItem icon={<Ruler size={12}/>} label="Hauteur" value={p.hauteur ? `${p.hauteur} m` : "-"} />
        <MetricItem icon={<Layers size={12}/>} label="Niveaux" value={p.nb_etages} />
        <MetricItem icon={<Calendar size={12}/>} label="Année" value={constructionYear} />
        <MetricItem icon={<ArrowUpFromLine size={12}/>} label="Alt. Max" value={p.z_max_toit ? `${Math.round(p.z_max_toit)} m` : "-"} />
      </div>
    </div>

    {(matMur || matToit || p.ids_rnb) && (
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex flex-col gap-2 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <MaterialBlock label="Murs" value={matMur} />
          <MaterialBlock label="Toiture" value={matToit} />
        </div>
        {p.ids_rnb && <RNBId id={p.ids_rnb} />}
      </div>
    )}
  </div>
);

const MetricItem = ({ icon, label, value }: any) => (
  <div className="bg-white p-3 flex flex-col items-start group hover:bg-gray-50">
    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
      {icon} {label}
    </span>
    <span className="text-sm font-semibold text-gray-900">{value ?? <span className="text-gray-300">-</span>}</span>
  </div>
);

const MaterialBlock = ({ label, value }: any) => (
  <div>
    <span className="block text-[10px] uppercase text-gray-400 font-semibold mb-1">{label}</span>
    <span className="text-gray-700 font-medium truncate block">{value || "—"}</span>
  </div>
);

const RNBId = ({ id }: { id: string }) => (
  <div className="mt-1 pt-2 border-t border-gray-200/60 flex items-center justify-between opacity-70">
    <div className="flex items-center gap-1.5 text-gray-500">
      <Hash size={10} />
      <span className="text-[10px] font-mono">ID RNB</span>
    </div>
    <span className="text-[10px] font-mono text-gray-600 bg-gray-200/50 px-1.5 rounded">{id}</span>
  </div>
);