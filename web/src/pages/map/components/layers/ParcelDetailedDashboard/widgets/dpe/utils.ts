export interface DpeColorSet {
  bg: string;
  text: string;
  border: string;
  bar: string;
  barLight: string;
}

export const DPE_PALETTE: Record<string, DpeColorSet> = {
  A: { bg: "bg-[#009B63]", text: "text-white", border: "border-[#007a4e]", bar: "#009B63", barLight: "#d0f0e4" },
  B: { bg: "bg-[#51B848]", text: "text-white", border: "border-[#3d9237]", bar: "#51B848", barLight: "#daf0d8" },
  C: { bg: "bg-[#C9D200]", text: "text-[#4a4e00]", border: "border-[#a0a800]", bar: "#C9D200", barLight: "#f5f7c0" },
  D: { bg: "bg-[#FFCC00]", text: "text-[#5a4700]", border: "border-[#c9a000]", bar: "#FFCC00", barLight: "#fff5c0" },
  E: { bg: "bg-[#F4A400]", text: "text-white", border: "border-[#c07e00]", bar: "#F4A400", barLight: "#fdecc4" },
  F: { bg: "bg-[#E8650A]", text: "text-white", border: "border-[#b54d06]", bar: "#E8650A", barLight: "#fbd9c0" },
  G: { bg: "bg-[#D61B23]", text: "text-white", border: "border-[#a71419]", bar: "#D61B23", barLight: "#f9c8ca" },
};

export const getDpeColors = (label?: string): DpeColorSet =>
  DPE_PALETTE[(label ?? "").toUpperCase()] ?? {
    bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200",
    bar: "#9ca3af", barLight: "#f3f4f6",
  };

export const DPE_SEUILS: Record<string, string> = {
  A: "≤ 70 kWh/m²/an",
  B: "71 – 110 kWh/m²/an",
  C: "111 – 180 kWh/m²/an",
  D: "181 – 250 kWh/m²/an",
  E: "251 – 330 kWh/m²/an",
  F: "331 – 420 kWh/m²/an",
  G: "≥ 421 kWh/m²/an",
};

export const DPE_LABELS_FR: Record<string, string> = {
  A: "Très performant",
  B: "Performant",
  C: "Assez performant",
  D: "Peu performant",
  E: "Énergivore",
  F: "Très énergivore",
  G: "Passoire thermique",
};

export const ORDERED_LABELS = ["A", "B", "C", "D", "E", "F", "G"] as const;

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
};

export const formatEuro = (val?: string | number): string => {
  const n = parseFloat(String(val ?? ""));
  if (isNaN(n) || n <= 0) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: "EUR", maximumFractionDigits: 0,
  }).format(n);
};