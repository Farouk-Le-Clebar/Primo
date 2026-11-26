import { ORDERED_LABELS, getDpeColors } from "../../ParcelDetailedDashboard/widgets/dpe/utils";

type DpeScaleProps = { active?: string };

export default function DpeScale({ active }: DpeScaleProps) {
  return (
    <div className="flex items-center gap-0.5" aria-label={active ? `Classe DPE dominante ${active}` : "Aucun DPE"}>
      {ORDERED_LABELS.map((label) => {
        const colors = getDpeColors(label);
        if (label === active)
          return (
            <span
              key={label}
              className={`flex h-[22px] min-w-[22px] items-center justify-center rounded-[5px] text-xs font-bold ${colors.bg} ${colors.text}`}
            >
              {label}
            </span>
          );
        return (
          <span
            key={label}
            className={`h-3.5 w-2.5 rounded-[3px] ${colors.bg} ${active ? "opacity-30" : "opacity-20"}`}
          />
        );
      })}
    </div>
  );
}
