import { HelpCircle } from "lucide-react";

export const DvfTooltip = () => (
  <div className="group relative flex items-center z-10">
    <button className="text-slate-400 hover:text-emerald-600 transition-colors p-1 rounded-full hover:bg-slate-100 outline-none">
      <HelpCircle size={18} />
    </button>
    <div className="absolute right-0 top-8 w-72 p-4 bg-slate-800 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 pointer-events-none z-50">
      <p className="font-bold text-slate-100 mb-1.5 text-sm">Valeurs Foncières (DVF)</p>
      <p className="leading-relaxed text-slate-300">
        Historique des transactions immobilières officielles enregistrées par les notaires et la DGFiP sur les 5 dernières années. Les prix affichés sont nets vendeurs (hors frais de notaire et agence).
      </p>
      <div className="absolute -top-1 right-2 w-2 h-2 bg-slate-800 rotate-45"></div>
    </div>
  </div>
);