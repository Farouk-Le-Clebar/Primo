import { FileText, Download, ExternalLink, type LucideIcon } from "lucide-react";

export interface DocumentAction {
  url: string;
  label: string;
  icon: LucideIcon;
  type: 'pdf' | 'zip' | 'external';
  source: 'OFFICIAL_ID' | 'OFFICIAL_PARTITION' | 'DIRECT' | 'SEARCH';
}

export const ZONE_DESCRIPTIONS: Record<string, { label: string; desc: string }> = {
  U: { label: "Zone Urbaine", desc: "Secteurs déjà urbanisés dotés d'équipements publics." },
  UA: { label: "Urbaine Dense", desc: "Centres-villes historiques, mixité habitat/commerce." },
  UB: { label: "Urbaine de Faubourg", desc: "Quartiers périphériques au centre, habitat collectif ou dense." },
  UC: { label: "Urbaine Pavillonnaire", desc: "Habitat individuel dominant avec jardins." },
  UD: { label: "Urbaine de Faible Densité", desc: "Zones résidentielles aérées, souvent en limite de ville." },
  UE: { label: "Urbaine d'Équipements", desc: "Dédiée aux services publics et équipements collectifs." },
  UI: { label: "Urbaine Industrielle", desc: "Zones d'activités économiques, artisanales et industrielles." },
  UX: { label: "Urbaine d'Activités", desc: "Zones commerciales et tertiaires en entrée de ville." },
  UV: { label: "Urbaine Paysagère", desc: "Parcs urbains, jardins et espaces verts protégés en ville." },
  UP: { label: "Urbaine Portuaire", desc: "Secteurs dédiés aux activités maritimes et portuaires." },
  AU: { label: "À Urbaniser", desc: "Zones destinées à être ouvertes à l'urbanisation." },
  "1AU": { label: "À Urbaniser Immédiat", desc: "Urbanisation possible après une opération d'ensemble (ZAC, Lotissement)." },
  "2AU": { label: "À Urbaniser Différé", desc: "Urbanisation bloquée tant que le PLU n'est pas modifié." },
  AUC: { label: "À Urbaniser Résidentiel", desc: "Futurs quartiers d'habitation." },
  AUE: { label: "À Urbaniser Économique", desc: "Futures zones d'activités." },
  A: { label: "Zone Agricole", desc: "Protection du potentiel agronomique et des exploitations." },
  Ap: { label: "Agricole Paysagère", desc: "Zone agricole avec une valeur paysagère forte à préserver." },
  As: { label: "Agricole de Serres", desc: "Secteurs spécialisés dans la culture sous abri." },
  N: { label: "Zone Naturelle", desc: "Protection des espaces naturels et des paysages." },
  ND: { label: "Naturelle de Dépôts", desc: "Secteurs autorisant certaines activités de stockage ou carrières." },
  NE: { label: "Naturelle d'Équipements", desc: "Autorise des équipements publics isolés en milieu naturel." },
  NH: { label: "Naturelle d'Habitat", desc: "Hameaux ou zones d'habitat dispersé en milieu naturel." },
  NI: { label: "Naturelle de Risques", desc: "Zones naturelles soumises à des risques (inondation, éboulement)." },
  NL: { label: "Naturelle de Loisirs", desc: "Camping, centres de vacances et sports de plein air." },
  NP: { label: "Naturelle Protégée", desc: "Protection stricte, souvent liée à des réserves ou biotopes." },
  NT: { label: "Naturelle Touristique", desc: "Secteurs dédiés aux infrastructures de tourisme nature." },
  NL100: { label: "Loisirs Littoral (100m)", desc: "Zone de loisirs soumise à la loi littoral (bande des 100m)." },
  SPR: { label: "Patrimoine Remarquable", desc: "Secteur avec règlementation architecturale stricte (ex-AVAP)." },
  DEFAULT: { label: "Zonage spécifique", desc: "Le règlement dépend d'une sous-zone locale définie par la mairie." }
};

export function getMainZoneType(typezone: string): string {
  const upper = typezone?.toUpperCase() || "";
  if (upper.startsWith("AU")) return "AU";
  if (upper.startsWith("U")) return "U";
  if (upper.startsWith("A")) return "A";
  if (upper.startsWith("N")) return "N";
  return "DEFAULT";
}

export function extractDepartement(featureId: string): string | null {
  const parts = featureId.split('_');
  if (parts.length >= 2) {
    const potentialDept = parts[1].split('.')[0];
    if (/^(\d{2,3}|2[AB])$/.test(potentialDept)) return potentialDept;
  }
  const parcelMatch = featureId.match(/(\d{2,3}|2[AB])\d{3}\d{6}/);
  return parcelMatch ? parcelMatch[1] : null;
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleDateString("fr-FR", { year: 'numeric', month: 'short' });
  } catch (e) {
    return dateString;
  }
}

export function getDocumentAction(props: any, inseeCode?: string ): DocumentAction | null {
  if (props.gpu_doc_id) {
    return {
      url: `https://www.geoportail-urbanisme.gouv.fr/document/by-id/${props.gpu_doc_id}/download-archive`,
      label: "TÉLÉCHARGER LE DOSSIER (OFFICIEL)",
      icon: Download,
      type: "zip",
      source: "OFFICIAL_ID"
    };
  }
  if (props.partition) {
    return {
      url: `https://www.geoportail-urbanisme.gouv.fr/api/document/download-by-partition/${props.partition}`,
      label: "TÉLÉCHARGER LE DOSSIER (PARTITION)",
      icon: Download,
      type: "zip",
      source: "OFFICIAL_PARTITION"
    };
  }
  if (props.urlfic && (props.urlfic.startsWith('http') || props.urlfic.startsWith('https'))) {
    return {
      url: props.urlfic,
      label: "VOIR LE RÈGLEMENT (PDF)",
      icon: FileText,
      type: "pdf",
      source: "DIRECT"
    };
  }
  if (inseeCode) {
    return {
      url: `https://www.geoportail-urbanisme.gouv.fr/document/?insee=${inseeCode}`,
      label: "RECHERCHER LES DOCUMENTS",
      icon: ExternalLink,
      type: "external",
      source: "SEARCH"
    };
  }

  return null;
}