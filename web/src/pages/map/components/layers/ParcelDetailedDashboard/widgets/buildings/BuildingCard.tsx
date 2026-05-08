import { Card, Text, Metric, Flex, Badge, Grid, Col } from "@tremor/react";
import { BuildingThumbnail } from "./BuildingThumbnail";

export const BuildingCard = ({ id, p, building, matMur, matToit, constructionYear, colorClasses }: any) => {
  
  const getEtatColor = (etat: string) => {
    switch (etat?.toLowerCase()) {
      case "en service": return "emerald";
      case "en construction": return "amber";
      case "en ruine": return "rose";
      default: return "slate";
    }
  };

  return (
    <Card id={id} className="mx-auto max-w-full scroll-mt-10 mb-6 p-4 border-gray-200">
      <Flex alignItems="start" className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-[#F0F0F0] dark:border-[#232323] bg-[#F8F9FB] dark:bg-[#232323] shadow-sm">
            <BuildingThumbnail feature={building} colorClasses={colorClasses} />
          </div>
          <div>
            <Text className="uppercase font-semibold tracking-wider text-[10px] text-gray-500 dark:text-gray-400 mb-1">
              {p.nature || "Bâtiment"}
            </Text>
            <Metric className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
              {p.usage1 || "Usage non défini"}
            </Metric>
            {p.etat && (
              <Badge color={getEtatColor(p.etat)} className="mt-2 text-[10px] text-white ">
                {p.etat}
              </Badge>
            )}
          </div>
        </div>
      </Flex>

      <Grid numItems={2} numItemsSm={2} className="gap-4">
        <Col>
          <Card className="p-3 bg-slate-50 dark:bg-[#232323] border-none ring-0 shadow-none">
            <Text className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Élévation</Text>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-700 dark:text-white">{p.hauteur ? `${p.hauteur}m` : '-'}</span>
              {p.nb_etages && <span className="text-xs text-gray-500 dark:text-gray-400">/ {p.nb_etages} niv.</span>}
            </div>
          </Card>
        </Col>

        <Col>
           <Card className="p-3 bg-slate-50 dark:bg-[#232323] border-none ring-0 shadow-none flex flex-col justify-between h-full">
            <Text className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Construction</Text>
            <span className="text-lg font-bold text-slate-700 dark:text-white mt-1">
              {constructionYear && constructionYear !== 'N/A' ? constructionYear : '-'}
            </span>
          </Card>
        </Col>

        <Col numColSpan={2} numColSpanSm={2}>
          <Card className="p-4 bg-slate-50 dark:bg-[#232323] border-none ring-0 shadow-none">
             <Text className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mb-3">Matériaux</Text>
             <Flex justifyContent="between" className="border-b border-gray-200 dark:border-[#333333] pb-2 mb-2">
               <span className="text-xs text-gray-500 dark:text-gray-400">Murs</span>
               <span className="text-xs font-semibold text-slate-700 dark:text-white">{matMur || '-'}</span>
             </Flex>
             <Flex justifyContent="between">
               <span className="text-xs text-gray-500 dark:text-gray-400">Toiture</span>
               <span className="text-xs font-semibold text-slate-700 dark:text-white">{matToit || '-'}</span>
             </Flex>
          </Card>
        </Col>
      </Grid>

      {p.ids_rnb && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#232323] flex justify-between items-center">
          <Text className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">ID RNB</Text>
          <span className="font-mono text-[11px] text-slate-600 dark:text-gray-300 bg-gray-100 dark:bg-[#232323] px-2 py-1 rounded-md">
            {p.ids_rnb}
          </span>
        </div>
      )}
    </Card>
  );
};