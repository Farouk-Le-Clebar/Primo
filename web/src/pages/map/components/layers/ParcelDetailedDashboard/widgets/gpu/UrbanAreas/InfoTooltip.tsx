import { HelpCircle } from "lucide-react";

export const InfoTooltip = () => (
  <div className="group relative flex items-center z-[100]">
    <button className="text-slate-400 hover:text-sky-600 transition-colors p-1 rounded-full hover:bg-slate-100 outline-none">
      <HelpCircle size={18} />
    </button>
    <div className="absolute right-0 top-8 w-72 p-4 bg-slate-800 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 pointer-events-none z-50">
      <p className="font-semibold text-white mb-2 text-[13px]">Zonage d'Urbanisme</p>
      <p className="leading-relaxed text-gray-300">
        Définit les règles de constructibilité de la parcelle selon le PLU. 
      </p>
      <div className="mt-2 space-y-1 text-gray-300">
        <p><span className="font-semibold text-white">U</span> : Urbaine (constructible)</p>
        <p><span className="font-semibold text-white">AU</span> : À Urbaniser (futur)</p>
        <p><span className="font-semibold text-white">A</span> : Agricole (restreint)</p>
        <p><span className="font-semibold text-white">N</span> : Naturelle (inconstructible)</p>
      </div>
      <div className="absolute -top-1 right-2 w-2 h-2 bg-slate-800 rotate-45"></div>
    </div>
  </div>
);