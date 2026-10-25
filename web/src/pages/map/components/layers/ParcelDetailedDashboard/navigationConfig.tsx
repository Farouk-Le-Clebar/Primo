import { ClipboardCheck, DoorOpen, FileText, Home, LayoutDashboard, MapPin, Scale, ShieldAlert, Zap } from "lucide-react";

export const NAVIGATION = [
  { id: "synthese", label: "Synthèse", type: "single", icon: LayoutDashboard },
  { id: "logement", label: "Logement", type: "single", icon: DoorOpen },
  { 
    id: "bati", label: "Bâti", type: "dropdown", 
    items: [
      { id: "batiments", label: "Bâtiments", icon: Home },
      { id: "dpe", label: "DPE", icon: Zap },
      { id: "autorisations", label: "Autorisations d’urbanisme", icon: ClipboardCheck },
    ] 
  },
  { 
    id: "urbanisme", label: "Foncier", type: "dropdown", 
    items: [
      { id: "plu", label: "PLU", icon: FileText },
      { id: "dvf", label: "DVF", icon: Scale }
    ] 
  },
  {
    id: "environnement", label: "Environnement", type: "dropdown",
    items: [
      { id: "georisques", label: "Géorisques", icon: ShieldAlert },
      { id: "pois", label: "Points d’intérêt", icon: MapPin }
    ]
  }
];


export const TAB_TITLES: Record<string, string> = {
  synthese: "Vue d’ensemble",
  logement: "Fiche logement",
  batiments: "Bâtiments",
  dpe: "Performance énergétique",
  autorisations: "Autorisations d’urbanisme",
  plu: "Urbanisme & réglementation",
  dvf: "Transactions immobilières",
  georisques: "Risques naturels & technologiques",
  pois: "Points d’intérêt à proximité",
};
