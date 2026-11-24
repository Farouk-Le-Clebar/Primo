const ABBREVIATIONS: Record<string, string> = {
  all: "allee",
  av: "avenue",
  ave: "avenue",
  bd: "boulevard",
  bld: "boulevard",
  bvd: "boulevard",
  ch: "chemin",
  che: "chemin",
  chem: "chemin",
  crs: "cours",
  fg: "faubourg",
  imp: "impasse",
  pas: "passage",
  pl: "place",
  pla: "place",
  qu: "quai",
  r: "rue",
  rte: "route",
  sq: "square",
  st: "saint",
  ste: "sainte",
};

export function addressKey(address: string | null | undefined): string | null {
  if (!address) return null;
  const words = address
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\b\d{5}\b.*$/, "")
    .replace(/(\d+)\s*(bis|ter|quater|[a-d])\b/g, "$1$2")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => ABBREVIATIONS[word] ?? word);
  return /^\d/.test(words[0] ?? "") && words.length > 1 ? words.join(" ") : null;
}

export const sameAddress = (a: string | null | undefined, b: string | null | undefined): boolean => {
  const keyA = addressKey(a);
  return keyA !== null && keyA === addressKey(b);
};
