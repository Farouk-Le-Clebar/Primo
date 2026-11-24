import { Briefcase, BriefcaseBusiness, GraduationCap, Heart, House, MapPin, TramFront, type LucideIcon } from "lucide-react";
import type { AddressCategory, ProjectAddress } from "../../../../types/project/addresses";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import type { Tone } from "../ui/palette";

type CategoryStyle = { label: string; plural: string; tone: Tone; icon: LucideIcon };

export const ADDRESS_CATEGORIES: Record<AddressCategory, CategoryStyle> = {
  agence: { label: "Agence", plural: "Agences", tone: "violet", icon: Briefcase },
  client: { label: "Client", plural: "Clients", tone: "pink", icon: House },
  ecole: { label: "École", plural: "Écoles", tone: "blue", icon: GraduationCap },
  transport: { label: "Transport", plural: "Transports", tone: "emerald", icon: TramFront },
  travail: { label: "Travail client", plural: "Travail", tone: "amber", icon: BriefcaseBusiness },
  sante: { label: "Santé", plural: "Santé", tone: "red", icon: Heart },
  autre: { label: "Autre", plural: "Autres", tone: "zinc", icon: MapPin },
};

export const ADDRESS_CATEGORY_ORDER: AddressCategory[] = ["client", "ecole", "transport", "agence", "travail", "sante", "autre"];

export type PlotDistance = { plot: ProjectPlotWithSummary; meters: number; minutes: number; byCar: boolean };

const EARTH_RADIUS_M = 6_371_000;
const ROUTE_FACTOR = 1.3;
const WALK_M_PER_MIN = 80;
const CAR_M_PER_MIN = 500;
const WALK_LIMIT_M = 3000;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

function haversine(latA: number, lonA: number, latB: number, lonB: number): number {
  const dLat = toRadians(latB - latA);
  const dLon = toRadians(lonB - lonA);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(latA)) * Math.cos(toRadians(latB)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

export function nearestPlots(address: ProjectAddress, plots: ProjectPlotWithSummary[], count = 2): PlotDistance[] {
  return plots
    .filter((plot) => plot.centroidLatitude != null && plot.centroidLongitude != null)
    .map((plot) => {
      const meters = Math.round(haversine(address.latitude, address.longitude, plot.centroidLatitude!, plot.centroidLongitude!) * ROUTE_FACTOR);
      const byCar = meters > WALK_LIMIT_M;
      return { plot, meters, byCar, minutes: Math.max(1, Math.round(meters / (byCar ? CAR_M_PER_MIN : WALK_M_PER_MIN))) };
    })
    .sort((a, b) => a.meters - b.meters)
    .slice(0, count);
}

export const formatMeters = (meters: number): string =>
  meters >= 1000 ? `${(meters / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} km` : `${Math.round(meters / 10) * 10} m`;
