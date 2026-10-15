import { text } from "../shared/format";
import type { GeorisquesData } from "./data";

export type RiskCardData = {
  id: string;
  title: string;
  communalStatus: string;
  identified: boolean;
  details: string[];
};

export function prepareRiskCards(data: GeorisquesData): RiskCardData[] {
  const risks = data.risques || [];
  const parents = risks.filter((r) => text(r.code, "").length === 2);
  const cards = risks
    .filter(
      (r) =>
        !parents.some(
          (p) =>
            text(r.code, "").length > 2 &&
            text(r.code, "").startsWith(text(p.code, "")),
        ),
    )
    .map((r) => {
      const code = text(r.code, "");
      const children = risks.filter(
        (child) =>
          code.length === 2 &&
          text(child.code, "").length > 2 &&
          text(child.code, "").startsWith(code),
      );
      return {
        id: `gaspar-${code}`,
        title: text(r.libelle),
        communalStatus: "Recensé",
        identified: true,
        details: [
          `Risque déclaré dans GASPAR pour ${data.commune}.`,
          ...children.map((child) => text(child.libelle)),
          "La présence dans la commune ne permet pas de déterminer si cette parcelle est exposée.",
        ],
      };
    });
  const seismic = text(data.properties.zone_sismicite, "Non renseigné");
  const seismicCard = cards.find((c) => /s[ée]ism/i.test(c.title));
  if (seismicCard) {
    seismicCard.communalStatus = seismic;
    seismicCard.details.push(
      "Zonage sismique communal ; aucune analyse de vulnérabilité du bâtiment.",
    );
  } else
    cards.push({
      id: "sismicite",
      title: "Séisme",
      communalStatus: seismic,
      identified: false,
      details: [
        "Zonage sismique communal ; aucune analyse de vulnérabilité du bâtiment.",
      ],
    });
  const radonCard = cards.find((c) => /radon/i.test(c.title));
  const radonDetails = [
    "Potentiel radon communal : il ne s’agit pas d’une mesure dans le bâtiment.",
    data.properties.statut_radon === "partiel"
      ? "La couverture des données est partielle."
      : "Les classes peuvent varier entre les arrondissements.",
  ];
  if (radonCard) {
    radonCard.communalStatus = data.radon;
    radonCard.details.push(...radonDetails);
  } else
    cards.push({
      id: "radon",
      title: "Radon",
      communalStatus: data.radon,
      identified: false,
      details: radonDetails,
    });
  return cards;
}
