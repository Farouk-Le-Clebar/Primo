import DvfWidget from "../widgets/dvf/DvfWidget";

export default function DvfTab({ feature }: { feature: any }) {
  return (
    <div className="flew-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#111111]">Données DVF</h2>
        <p className="text-[13px] text-[#878D96] mt-1">
          Analyse des données de la DVF (Dossier de Vente Foncière).
        </p>
      </div>

      <div className="">
        <DvfWidget feature={feature} />
      </div>

    </div>
  );
}