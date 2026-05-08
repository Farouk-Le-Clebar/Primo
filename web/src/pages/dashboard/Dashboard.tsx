import { Card } from '@tremor/react';

function ContentPlaceholder() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-white/10">
      <svg
        className="absolute inset-0 h-full w-full stroke-gray-300 dark:stroke-gray-700/50"
        fill="none"
      >
        <defs>
          <pattern
            id="pattern-1"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
          </pattern>
        </defs>
        <rect
          stroke="none"
          fill="url(#pattern-1)"
          width="100%"
          height="100%"
        ></rect>
      </svg>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0A0A0A] px-8 font-inter">

      <main>
        <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm overflow-hidden rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-white/10">
            
            <div className="p-4 md:col-span-4 flex flex-col gap-4">
              <div className="h-24">
                <ContentPlaceholder />
              </div>
              <div className="h-24">
                <ContentPlaceholder />
              </div>
              <div className="h-24">
                <ContentPlaceholder />
              </div>
            </div>

            <div className="p-4 md:col-span-8 min-h-[300px] flex flex-col">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                Évolution du prix de l'immobilier (DVF)
              </h3>
              <div className="flex-1">
                <ContentPlaceholder />
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          
          <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden">
            <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Répartition des zones d'urbanisme
              </h3>
            </div>
            <div className="h-64 p-4">
              <ContentPlaceholder />
            </div>
          </Card>

          <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden">
            <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Typologie des bâtiments (BdTopo)
              </h3>
            </div>
            <div className="h-64 p-4">
              <ContentPlaceholder />
            </div>
          </Card>

          <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden">
            <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Dernières parcelles ajoutées
              </h3>
            </div>
            <div className="h-72 p-4">
              <ContentPlaceholder />
            </div>
          </Card>

          <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden bg-gray-50 dark:bg-[#111111]/50">
            <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Activité récente
              </h3>
            </div>
            <div className="h-72 p-4">
              <ContentPlaceholder />
            </div>
          </Card>

        </div>
      </main>
    </div>
  );
}