import GpuInformationsWidget from "../widgets/gpu/Informations/GpuInformationsWidget";

export default function InformationsTab({ feature }: { feature: any }) {
  return (
    <div className="flew-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#111111]">Informations complémentaires</h2>
        <p className="text-[13px] text-[#878D96] mt-1">
          Données additionnelles sur la parcelle issues du Géoportail, incluant les usages du sol, les risques naturels et les infrastructures présentes.
        </p>
      </div>

      <div className="">
        <GpuInformationsWidget feature={feature} />
      </div>

    </div>
  );
}