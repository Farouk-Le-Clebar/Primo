import type { InstallationClassee, SitePollue } from "../../../../../../../types/environnement";
import { formatDistance } from "../shared/useParcelPoint";

export type PollutionRow = {
  id: string;
  title: string;
  subtitle: string;
  distance: string;
  link: string | null;
};

const AIR_LEVELS: { max: number; label: string }[] = [
  { max: 20, label: "Bon" },
  { max: 40, label: "Correct" },
  { max: 60, label: "Moyen" },
  { max: 80, label: "Médiocre" },
  { max: 100, label: "Mauvais" },
];

export const airLevel = (index: number | null): string =>
  index === null ? "Indisponible" : AIR_LEVELS.find(({ max }) => index <= max)?.label ?? "Très mauvais";

export const micrograms = (value: number | null): string =>
  value === null ? "—" : `${value.toFixed(1).replace(".", ",")} µg/m³`;

export const siteRow = (site: SitePollue): PollutionRow => ({
  id: site.id,
  title: site.nom ?? "Établissement non nommé",
  subtitle: [site.adresse, site.statut].filter(Boolean).join(" · "),
  distance: formatDistance(site.distanceMetres),
  link: site.fiche,
});

export const installationRow = (installation: InstallationClassee): PollutionRow => ({
  id: installation.id,
  title: installation.nom ?? "Installation non nommée",
  subtitle: [installation.adresse, installation.regime, installation.seveso && installation.seveso !== "Non Seveso" ? `Seveso ${installation.seveso}` : null]
    .filter(Boolean)
    .join(" · "),
  distance: formatDistance(installation.distanceMetres),
  link: null,
});
