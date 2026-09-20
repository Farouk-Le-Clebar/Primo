import { LayoutDashboard, Home, Zap, FileText, Scale, ShieldAlert } from "lucide-react";

export const NAVIGATION = [
  { id: "synthese", label: "Synthèse", type: "single", icon: LayoutDashboard },
  { 
    id: "bati", label: "Bâti", type: "dropdown", 
    items: [
      { id: "batiments", label: "Bâtiments", icon: Home },
      { id: "dpe", label: "DPE", icon: Zap },
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
      { id: "georisques", label: "Géorisques", icon: ShieldAlert }
    ]
  }
];