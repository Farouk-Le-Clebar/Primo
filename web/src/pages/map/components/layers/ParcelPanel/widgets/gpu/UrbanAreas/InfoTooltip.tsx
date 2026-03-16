import { HelpCircle } from "lucide-react";

export const PluTooltip = () => (
  <div className="group relative flex items-center z-10">
    <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-slate-100 outline-none">
      <HelpCircle size={18} />
    </button>
    <div className="absolute right-0 top-8 w-72 p-4 bg-slate-800 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 pointer-events-none z-50">
      <p className="font-bold text-slate-100 mb-1.5 text-sm">Zonage d'Urbanisme (PLU/PLUi)</p>
      <p className="leading-relaxed text-slate-300">
        Définit les règles de constructibilité de la parcelle selon le Plan Local d'Urbanisme. 
        <br/><br/>
        <span className="font-semibold text-white">U</span> : Urbaine (constructible)<br/>
        <span className="font-semibold text-white">AU</span> : À Urbaniser (projets futurs)<br/>
        <span className="font-semibold text-white">A</span> : Agricole (très restreint)<br/>
        <span className="font-semibold text-white">N</span> : Naturelle (inconstructible sauf exception)
      </p>
      <div className="absolute -top-1 right-2 w-2 h-2 bg-slate-800 rotate-45"></div>
    </div>
  </div>
);