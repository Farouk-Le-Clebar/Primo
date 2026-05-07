import { useQuery } from "@tanstack/react-query";
import { Grid, Col } from "@tremor/react";

// COMPOENENTS
import { getDpeBan } from "../../../../../../../requests/dpe/information";
import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";
import DpeSummaryCard from "./DpeSummaryCard";
import DpeDistributionCard from "./DpeDistributionCard";
import DpeList from "./DpeList";

export default function DpeWidget({ selectedParcelle }: { selectedParcelle: any }) {
  const addokFeatures  = selectedParcelle?.addokData?.features;
  const identifiantBan = addokFeatures?.length > 0 ? addokFeatures[0].properties.id : null;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dpe-ban", identifiantBan],
    queryFn:  () => getDpeBan(String(identifiantBan)),
    enabled:  !!identifiantBan,
    retry:    false,
  });
  

  const dpeList: any[] = Array.isArray(data) ? data : (data?.historique ?? []);
  const isEmpty        = !dpeList || dpeList.length === 0;

  return (
    <div className="font-inter w-full">
      {isLoading ? (
        <div className="flex items-center gap-2 mb-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <LoadingPrimoLogo className="w-6 h-6 text-emerald-500" />
          <span className="text-[13px] font-medium text-[#878D96]">
            Analyse énergétique en cours…
          </span>
        </div>
      ) : isError || isEmpty ? (
        <div className="py-8 text-sm text-[#878D96] text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          Aucun DPE enregistré pour cette adresse depuis la réforme de juillet 2021.
        </div>
      ) : (
        <Grid numItems={1} numItemsMd={3} className="gap-6 w-full relative">

          <Col numColSpan={1}>
            <div className="sticky top-0 h-182 flex flex-col">
              <DpeSummaryCard dpeList={dpeList} />
            </div>
          </Col>

          <Col numColSpan={1} numColSpanMd={2} className="pb-10 flex flex-col gap-6">
             <DpeDistributionCard dpeList={dpeList} />
             <DpeList dpeList={dpeList} />
          </Col>

        </Grid>
      )}
    </div>
  );
}