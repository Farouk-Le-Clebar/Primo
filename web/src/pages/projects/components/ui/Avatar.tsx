import { TONES, initialsOf, toneFor } from "./palette";

type AvatarProps = { name: string; size?: "xs" | "sm" | "md"; square?: boolean };

const SIZES = { xs: "h-5 w-5 text-[8px]", sm: "h-6 w-6 text-[9px]", md: "h-8 w-8 text-[11px]" };

export default function Avatar({ name, size = "sm", square = false }: AvatarProps) {
  const tone = TONES[toneFor(name)];
  return (
    <span className={`flex shrink-0 items-center justify-center font-bold ${SIZES[size]} ${square ? "rounded-lg" : "rounded-full"} ${tone.soft} ${tone.text}`}>
      {initialsOf(name)}
    </span>
  );
}
