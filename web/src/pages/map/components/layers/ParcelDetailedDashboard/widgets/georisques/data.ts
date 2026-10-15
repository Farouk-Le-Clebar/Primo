import { jsonRows, text, type SourceRow } from "../shared/format";

export function prepareGeorisques(properties: SourceRow) {
  const risques = jsonRows(properties.risques_json);
  const catnat = jsonRows(properties.catnat_json);
  return {
    properties,
    risques,
    catnat:
      catnat
        ?.slice()
        .sort((a, b) =>
          text(b.date_debut, "").localeCompare(text(a.date_debut, "")),
        ) ?? null,
    commune: text(properties.nom_commune),
    radon:
      properties.statut_radon === "donnee_indisponible"
        ? "Non renseigné"
        : properties.classe_radon != null
          ? `Classe ${text(properties.classe_radon)}`
          : text(properties.classes_radon, "")
            ? `Classes ${text(properties.classes_radon)}`
            : "Non renseigné",
  };
}
export type GeorisquesData = ReturnType<typeof prepareGeorisques>;
