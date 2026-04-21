import { Card, Text, Metric, Flex, Badge, Tracker, ProgressBar, Grid, Col } from "@tremor/react";
import { BuildingThumbnail } from "./BuildingThumbnail";

export const BuildingCard = ({ id, p, building, matMur, matToit, constructionYear, colorClasses }: any) => {
  
  // Fonction pour déterminer la couleur du badge en fonction de l'état
  const getEtatColor = (etat: string) => {
    switch (etat?.toLowerCase()) {
      case "en service": return "emerald";
      case "en construction": return "amber";
      case "en ruine": return "rose";
      default: return "slate";
    }
  };

  return (
    <Card id={id} className="mx-auto max-w-full scroll-mt-10 mb-6 p-4">
      {/* En-tête : Thumbnail + Infos Principales */}
      <Flex alignItems="start" className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-[#F0F0F0] bg-[#F8F9FB] shadow-sm">
            <BuildingThumbnail feature={building} colorClasses={colorClasses} />
          </div>
          <div>
            <Text className="uppercase font-semibold tracking-wider text-[10px] text-gray-500 mb-1">
              {p.nature || "Bâtiment"}
            </Text>
            <Metric className="text-lg font-bold text-slate-800 leading-tight">
              {p.usage1 || "Usage non défini"}
            </Metric>
            {p.etat && (
              <Badge color={getEtatColor(p.etat)} className="mt-2 text-[10px]">
                {p.etat}
              </Badge>
            )}
          </div>
        </div>
      </Flex>

      {/* Grille d'informations façon Bento */}
      <Grid numItems={2} numItemsSm={2} className="gap-4">
        
        {/* Hauteur / Niveaux */}
        <Col>
          <Card className="p-3 bg-slate-50 border-none ring-0 shadow-none">
            <Text className="text-[11px] text-gray-500 font-medium">Élévation</Text>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-700">{p.hauteur ? `${p.hauteur}m` : '-'}</span>
              {p.nb_etages && <span className="text-xs text-gray-500">/ {p.nb_etages} niv.</span>}
            </div>
            {/* Petite jauge visuelle (Tracker ou ProgressBar) juste pour l'esthétique */}
            {p.hauteur && (
              <ProgressBar value={(p.hauteur / 50) * 100} color="indigo" className="mt-2 h-1" />
            )}
          </Card>
        </Col>

        {/* Année de construction */}
        <Col>
           <Card className="p-3 bg-slate-50 border-none ring-0 shadow-none flex flex-col justify-between h-full">
            <Text className="text-[11px] text-gray-500 font-medium">Construction</Text>
            <span className="text-lg font-bold text-slate-700 mt-1">
              {constructionYear && constructionYear !== 'N/A' ? constructionYear : '-'}
            </span>
          </Card>
        </Col>

        {/* Matériaux (prend toute la largeur) */}
        <Col numColSpan={2} numColSpanSm={2}>
          <Card className="p-4 bg-slate-50 border-none ring-0 shadow-none">
             <Text className="text-[11px] text-gray-500 font-medium mb-3">Matériaux</Text>
             <Flex justifyContent="between" className="border-b border-gray-200 pb-2 mb-2">
               <span className="text-xs text-gray-500">Murs</span>
               <span className="text-xs font-semibold text-slate-700">{matMur || '-'}</span>
             </Flex>
             <Flex justifyContent="between">
               <span className="text-xs text-gray-500">Toiture</span>
               <span className="text-xs font-semibold text-slate-700">{matToit || '-'}</span>
             </Flex>
          </Card>
        </Col>
      </Grid>

      {/* ID RNB Footer */}
      {p.ids_rnb && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <Text className="text-[11px] text-gray-500 font-medium">ID RNB</Text>
          <span className="font-mono text-[11px] text-slate-600 bg-gray-100 px-2 py-1 rounded-md">
            {p.ids_rnb}
          </span>
        </div>
      )}
    </Card>
  );
};