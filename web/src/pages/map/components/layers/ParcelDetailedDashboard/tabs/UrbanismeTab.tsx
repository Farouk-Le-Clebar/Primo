import GpuUrbanAreasWidget from "../widgets/gpu/UrbanAreas/GpuUrbanAreasWidget";

export default function UrbanismeTab({ feature }: { feature: any }) {
  return (
    <div className="flew-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#111111]">Règles d'urbanisme (PLU)</h2>
        <p className="text-[13px] text-[#878D96] mt-1">
          Analyse des documents d'urbanisme, du zonage et de la constructibilité via le Géoportail de l'Urbanisme.
        </p>
      </div>

      <div className="">
        <GpuUrbanAreasWidget feature={feature} />
      </div>

    </div>
  );
}