import GpuPrescriptionsWidget from "../widgets/gpu/Prescriptions/GpuPrescriptionsWidget";

export default function PrescriptionsTab({ feature }: { feature: any }) {
  return (
    <div className="flew-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#111111]">Servitudes et Prescriptions</h2>
        <p className="text-[13px] text-[#878D96] mt-1">
          Inventaire des contraintes environnementales et des servitudes d'utilité publique s'appliquant à la parcelle.
        </p>
      </div>

      <div className="">
        <GpuPrescriptionsWidget feature={feature} />
      </div>

    </div>
  );
}