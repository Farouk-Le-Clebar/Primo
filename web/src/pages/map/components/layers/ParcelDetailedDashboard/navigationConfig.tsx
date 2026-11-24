import { Building, ClipboardCheck, Factory, Wifi, Coins, DoorOpen, FileText, Home, KeyRound, LayoutDashboard, MapPin, Scale, ShieldAlert, Thermometer, Zap } from "lucide-react";

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
    id: "habitat", label: "Habitat", type: "dropdown",
    items: [
      { id: "copropriete", label: "Copropriété", icon: Building },
      { id: "logements-sociaux", label: "Logements sociaux", icon: KeyRound },
      { id: "loyers", label: "Loyers & rendement", icon: Coins },
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
      { id: "pollution", label: "Pollution", icon: Factory },
      { id: "pois", label: "Points d’intérêt", icon: MapPin },
      { id: "meteo", label: "Météo", icon: Thermometer },
      { id: "connexion", label: "Connexion", icon: Wifi }
    ]
  }
];


export const TAB_TITLES: Record<string, string> = {
  synthese: "Vue d’ensemble",
  logement: "Fiche logement",
  batiments: "Bâtiments",
  dpe: "Performance énergétique",
  autorisations: "Autorisations d’urbanisme",
  copropriete: "Copropriété",
  "logements-sociaux": "Logements sociaux",
  loyers: "Loyers & rendement locatif",
  plu: "Urbanisme & réglementation",
  dvf: "Transactions immobilières",
  georisques: "Risques naturels & technologiques",
  pois: "Points d’intérêt à proximité",
  meteo: "Climat & météo",
  pollution: "Pollution des sols & de l’air",
  connexion: "Connexion internet & mobile",
};
