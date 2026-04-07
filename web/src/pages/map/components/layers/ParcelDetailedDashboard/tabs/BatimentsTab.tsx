import BuildingsWidget from "../widgets/buildings/BuildingsWidget";

export default function BatimentsTab({ feature }: { feature: any }) {
  return (
    <div className="flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ">
        <div className="flex-col w-full mb-6 ">
            <h2 className="text-2xl font-bold text-[#111111]">Inventaire du bâti</h2>
            <p className="text-[13px] text-[#878D96] mt-1">
                Analyse des structures détectées sur la parcelle via la BD Topo.
            </p>
        </div>

        <div className="">
            <BuildingsWidget feature={feature} />
        </div>
    </div>
  );
}