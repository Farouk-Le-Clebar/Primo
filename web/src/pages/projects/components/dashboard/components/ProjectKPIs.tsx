import { Layers, Users, Calendar } from "lucide-react";

interface ProjectKPIsProps {
  plotsCount: number;
  membersCount: number;
  createdAt?: string;
}

export default function ProjectKPIs({ plotsCount, membersCount, createdAt }: ProjectKPIsProps) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-[#999999] font-medium">Parcelles sourcées</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{plotsCount}</p>
        </div>
        <div className="p-2 rounded-lg text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10">
          <Layers className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-[#999999] font-medium">Collaborateurs actifs</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{membersCount}</p>
        </div>
        <div className="p-2 rounded-lg text-teal-600 dark:text-teal-500 bg-teal-50 dark:bg-teal-500/10">
          <Users className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-[#999999] font-medium">Création</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">
            {createdAt 
              ? new Date(createdAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' }) 
              : "Récemment"}
          </p>
        </div>
        <div className="p-2 rounded-lg text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5">
          <Calendar className="w-4 h-4" />
        </div>
      </div>
    </>
  );
}