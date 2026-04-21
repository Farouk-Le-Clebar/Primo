import { BuildingThumbnail } from "./BuildingThumbnail";

export const BuildingCard = ({ p, building, matMur, matToit, constructionYear }: any) => {
  
  const InfoRow = ({ label, value, isLast = false }: { label: string, value: string | React.ReactNode, isLast?: boolean }) => (
    <div className={`flex justify-between items-center py-2.5 ${!isLast ? 'border-b border-[#F0F0F0]' : ''}`}>
      <span className="text-[13px] font-medium text-[#878D96]">{label}</span>
      <span className="text-[13px] font-medium text-[#111111] text-right">{value}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#F0F0F0]">
        <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-[#F0F0F0] bg-[#F8F9FB]">
          <BuildingThumbnail feature={building} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#878D96] uppercase tracking-wider mb-1">
            {p.nature || "Bâtiment"}
          </span>
          <h4 className="text-[15px] font-semibold text-[#111111] leading-tight">
            {p.usage1 || "Usage non défini"}
          </h4>
          {p.etat && p.etat !== "En service" && (
            <span className="text-xs font-medium text-orange-600 mt-1">
              {p.etat}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        {p.hauteur && (
          <InfoRow 
            label="Hauteur" 
            value={`${p.hauteur} m`} 
          />
        )}
        {p.nb_etages !== undefined && p.nb_etages !== null && (
          <InfoRow 
            label="Niveaux" 
            value={p.nb_etages} 
          />
        )}

        {constructionYear && constructionYear !== 'N/A' && (
          <InfoRow 
            label="Année de construction" 
            value={constructionYear} 
          />
        )}

        {matMur && (
          <InfoRow 
            label="Matériau des murs" 
            value={matMur} 
          />
        )}

        {matToit && (
          <InfoRow 
            label="Matériau de toiture" 
            value={matToit} 
            isLast={!p.ids_rnb} // Si pas d'ID RNB, c'est la dernière ligne
          />
        )}

        {p.ids_rnb && (
          <InfoRow 
            label="ID RNB" 
            value={<span className="font-mono text-[12px] bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{p.ids_rnb}</span>} 
            isLast={true}
          />
        )}
      </div>
    </div>
  );
};