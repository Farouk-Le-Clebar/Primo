import GpuUrbanAreasWidget from "../widgets/gpu/GpuWidget";

export default function UrbanismeTab({ feature }: { feature: any }) {
  return (
    <div className="flew-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="">
        <GpuUrbanAreasWidget feature={feature} />
      </div>
    </div>
  );
}