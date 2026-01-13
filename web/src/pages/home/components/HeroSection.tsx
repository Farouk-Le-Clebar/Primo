import { Building2, Map as MapIcon, Users, ShieldAlert } from "lucide-react";

export default function HeroSection() {
  // Données factices pour remplir les widgets
  const miniWidgets = [
    { label: "Parcelles", icon: <MapIcon size={16} />, value: "1,240" },
    { label: "Bâtiments", icon: <Building2 size={16} />, value: "850" },
    { label: "Propriétaires", icon: <Users size={16} />, value: "420" },
    { label: "Risques", icon: <ShieldAlert size={16} />, value: "12" },
  ];

  return (
    <section className="min-h-full w-full flex flex-col items-center py-8 px-6">
      
      {/* Container des 4 petits widgets - Centré via mx-auto ou parent items-center */}
      <div className="flex gap-4 justify-center w-full max-w-[1080px]">
        {miniWidgets.map((widget, i) => (
          <div
            key={i}
            className="w-64 h-16 bg-white border border-[#E6E7EB] rounded-xl flex items-center px-4 gap-3 shadow-sm"
          >
            <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
              {widget.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {widget.label}
              </span>
              <span className="text-sm font-bold text-gray-800">
                {widget.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Grands carrés de contenu - Centrés */}
      <div className="space-y-6 mt-8">
        <div className="w-[1080px] h-[560px] bg-white border border-[#E6E7EB] rounded-3xl shadow-sm flex items-center justify-center">
          <p className="text-gray-400 font-medium">Visualisation principale ou Graphiques</p>
        </div>
        
        <div className="w-[1080px] h-[560px] mb-8 bg-white border border-[#E6E7EB] rounded-3xl shadow-sm flex items-center justify-center">
          <p className="text-gray-400 font-medium">Historique ou Données complémentaires</p>
        </div>
      </div>

    </section>
  );
}