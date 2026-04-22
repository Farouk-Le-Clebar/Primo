import BuildingsWidget from "../widgets/buildings/BuildingsWidget";

export default function BatimentsTab({ feature }: { feature: any }) {
  return (
    <div className="flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ">
        <div className="">
            <BuildingsWidget feature={feature} />
        </div>
    </div>
  );
}