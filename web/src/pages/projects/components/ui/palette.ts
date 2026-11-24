export type Tone = "violet" | "blue" | "amber" | "emerald" | "rose" | "pink" | "zinc" | "red" | "orange";

export const TONES: Record<Tone, { soft: string; text: string; dot: string }> = {
  violet: { soft: "bg-violet-500/12 dark:bg-violet-500/20", text: "text-violet-500", dot: "bg-violet-500" },
  blue: { soft: "bg-blue-500/12 dark:bg-blue-500/20", text: "text-blue-500", dot: "bg-blue-500" },
  amber: { soft: "bg-amber-500/12 dark:bg-amber-500/20", text: "text-amber-500", dot: "bg-amber-500" },
  emerald: { soft: "bg-emerald-500/12 dark:bg-emerald-500/20", text: "text-emerald-500", dot: "bg-emerald-500" },
  rose: { soft: "bg-rose-500/12 dark:bg-rose-500/20", text: "text-rose-500", dot: "bg-rose-500" },
  pink: { soft: "bg-pink-500/12 dark:bg-pink-500/20", text: "text-pink-500", dot: "bg-pink-500" },
  zinc: { soft: "bg-[#1c1c1e]/6 dark:bg-white/8", text: "text-[#52525b] dark:text-[#d4d4d8]", dot: "bg-zinc-500" },
  red: { soft: "bg-red-500/12 dark:bg-red-500/20", text: "text-red-500", dot: "bg-red-500" },
  orange: { soft: "bg-orange-500/12 dark:bg-orange-500/20", text: "text-orange-500", dot: "bg-orange-500" },
};

const HASHED_TONES: Tone[] = ["violet", "blue", "amber", "emerald", "pink", "rose"];

export function toneFor(seed: string): Tone {
  const hash = [...seed].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);
  return HASHED_TONES[hash % HASHED_TONES.length];
}

export function initialsOf(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]?.toUpperCase()).join("") || "?";
}
