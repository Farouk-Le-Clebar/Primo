import { TAB_TITLES } from "./navigationConfig";

type ParcelPageHeaderProps = {
  parcelId: string;
  address: string;
  activeTab: string;
};

export default function ParcelPageHeader({ parcelId, address, activeTab }: ParcelPageHeaderProps) {
  return (
    <div className="mb-6 font-inter">
      <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Parcelle {parcelId}</p>
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{TAB_TITLES[activeTab]}</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{address}</p>
    </div>
  );
}
