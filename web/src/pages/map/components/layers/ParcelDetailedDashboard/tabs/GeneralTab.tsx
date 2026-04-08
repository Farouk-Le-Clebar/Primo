import { ParcelInfoCard } from "../../ParcelPanel/ParcelleInfoCard";

export default function GeneralTab({ feature }: { feature: any }) {
  return (
    <div className="flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#111111]">Synthèse générale</h2>
        <p className="text-[13px] text-[#878D96] mt-1">
          Informations clés, identifiants administratifs et surface de la parcelle.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ParcelInfoCard properties={feature?.properties} />
      </div>

    </div>
  );
}