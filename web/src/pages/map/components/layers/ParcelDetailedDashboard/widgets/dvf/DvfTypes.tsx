import PanelCard from "../shared/PanelCard";
import ShareList, { type ShareItem } from "../shared/ShareList";
import { getTypeLocalStyle } from "./utils";

type DvfTypesProps = {
  shares: { key: string; count: number }[];
  active: string | null;
  onSelect: (type: string | null) => void;
};

export default function DvfTypes({ shares, active, onSelect }: DvfTypesProps) {
  const items: ShareItem[] = shares.map(({ key, count }) => {
    const { icon: Icon, tone } = getTypeLocalStyle(key);
    return {
      key,
      label: key,
      count,
      badge: (
        <span className={`flex h-6 w-6 items-center justify-center rounded-md ${tone}`}>
          <Icon size={13} />
        </span>
      ),
    };
  });

  return (
    <PanelCard title="Types de biens" aside="Cliquer pour filtrer">
      <ShareList items={items} active={active} onSelect={onSelect} />
    </PanelCard>
  );
}
