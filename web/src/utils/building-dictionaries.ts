export const WALL_MATERIALS: Record<string, string> = {
  "0": "Indéterminé", "00": "Indéterminé",
  "1": "Pierre", "01": "Pierre",
  "2": "Meulière", "02": "Meulière",
  "3": "Béton", "03": "Béton",
  "4": "Briques", "04": "Briques",
  "5": "Aggloméré", "05": "Aggloméré",
  "6": "Bois", "06": "Bois",
  "9": "Autres", "09": "Autres",

  "10": "Pierre",
  "11": "Pierre",
  "12": "Meulière - Pierre",
  "13": "Béton - Pierre",
  "14": "Briques - Pierre",
  "15": "Aggloméré - Pierre",
  "16": "Bois - Pierre",
  "19": "Pierre - Autres",

  "20": "Meulière",
  "21": "Meulière - Pierre",
  "22": "Meulière",
  "23": "Béton - Meulière",
  "24": "Briques - Meulière",
  "25": "Aggloméré - Meulière",
  "26": "Bois - Meulière",
  "29": "Meulière - Autres",

  "30": "Béton",
  "31": "Béton - Pierre",
  "32": "Béton - Meulière",
  "33": "Béton",
  "34": "Béton - Briques",
  "35": "Aggloméré - Béton",
  "36": "Béton - Bois",
  "39": "Béton - Autres",

  "40": "Briques",
  "41": "Briques - Pierre",
  "42": "Briques - Meulière",
  "43": "Béton - Briques",
  "44": "Briques",
  "45": "Aggloméré - Briques",
  "46": "Bois - Briques",
  "49": "Briques - Autres",

  "50": "Aggloméré",
  "51": "Aggloméré - Pierre",
  "52": "Aggloméré - Meulière",
  "53": "Aggloméré - Béton",
  "54": "Aggloméré - Briques",
  "55": "Aggloméré",
  "56": "Aggloméré - Bois",
  "59": "Aggloméré - Autres",

  "60": "Bois",
  "61": "Bois - Pierre",
  "62": "Bois - Meulière",
  "63": "Béton - Bois",
  "64": "Bois - Briques",
  "65": "Aggloméré - Bois",
  "66": "Bois",
  "69": "Bois - Autres",

  "90": "Autres",
  "91": "Pierre - Autres",
  "92": "Meulière - Autres",
  "93": "Béton - Autres",
  "94": "Briques - Autres",
  "95": "Aggloméré - Autres",
  "96": "Bois - Autres",
  "99": "Autres"
};

export const ROOF_MATERIALS: Record<string, string> = {
  "0": "Indéterminé", "00": "Indéterminé",
  "1": "Tuiles", "01": "Tuiles",
  "2": "Ardoises", "02": "Ardoises",
  "3": "Zinc / Alu", "03": "Zinc / Alu",
  "4": "Béton", "04": "Béton",
  "9": "Autres", "09": "Autres",

  "10": "Tuiles",
  "11": "Tuiles",
  "12": "Ardoises - Tuiles",
  "13": "Tuiles - Zinc/Alu",
  "14": "Béton - Tuiles",
  "19": "Tuiles - Autres",

  "20": "Ardoises",
  "21": "Ardoises - Tuiles",
  "22": "Ardoises",
  "23": "Ardoises - Zinc/Alu",
  "24": "Ardoises - Béton",
  "29": "Ardoises - Autres",

  "30": "Zinc / Alu",
  "31": "Tuiles - Zinc/Alu",
  "32": "Ardoises - Zinc/Alu",
  "33": "Zinc / Alu",
  "34": "Béton - Zinc/Alu",
  "39": "Zinc/Alu - Autres",

  "40": "Béton",
  "41": "Béton - Tuiles",
  "42": "Ardoises - Béton",
  "43": "Béton - Zinc/Alu",
  "44": "Béton",
  "49": "Béton - Autres",

  "90": "Autres",
  "91": "Tuiles - Autres",
  "92": "Ardoises - Autres",
  "93": "Zinc/Alu - Autres",
  "94": "Béton - Autres",
  "99": "Autres"
};


export function getMaterialLabel(
  code: string | number | null | undefined, 
  dictionary: Record<string, string>
): string | null {
  if (code === null || code === undefined) return null;
  
  const strCode = code.toString();
  if (dictionary[strCode]) return dictionary[strCode];
  
  const paddedCode = strCode.length === 1 ? `0${strCode}` : strCode;
  if (dictionary[paddedCode]) return dictionary[paddedCode];

  return null;
}