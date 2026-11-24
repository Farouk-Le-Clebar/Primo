import { TONES, type Tone } from "./palette";

type TagProps = { tone: Tone; children: React.ReactNode; size?: "xs" | "sm" };

export default function Tag({ tone, children, size = "xs" }: TagProps) {
  const style = TONES[tone];
  const sizing = size === "xs" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-[5px] text-xs";
  return <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full font-semibold ${sizing} ${style.soft} ${style.text}`}>{children}</span>;
}
