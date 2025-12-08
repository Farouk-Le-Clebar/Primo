import { Search, BarChart3, Map } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="min-h-screen flex flex-col justify-center items-center py-16 md:py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Nos <span className="text-green-600">Fonctionnalités</span>
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-sm md:text-base">
            Une plateforme complète pour vous accompagner dans votre recherche
            immobilière
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          <div className="bg-linear-to-br from-white to-green-50 border border-green-100 rounded-xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <Search className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold">Assistant IA</h3>
            </div>

            <p className="text-gray-700 mb-6">
              Notre IA basée sur une architecture RAG vous aide à prendre des
              décisions éclairées
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-green-600 pl-4">
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Search size={20} className="text-green-600" />
                  Recherche intelligente
                </h4>
                <p className="text-gray-600">
                  Définissez vos critères et notre IA vous suggère des zones
                  géographiques et parcelles adaptées à vos besoins. Réponses en
                  langage naturel avec justifications détaillées.
                </p>
              </div>

              <div className="border-l-4 border-green-600 pl-4">
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <BarChart3 size={20} className="text-green-600" />
                  Comparaison avancée
                </h4>
                <p className="text-gray-600">
                  Comparez plusieurs parcelles avec une notation automatique et
                  des commentaires personnalisés. L'IA explique pourquoi une
                  parcelle correspond mieux à vos critères.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-white to-green-50 border border-green-100 rounded-xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <Map className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold">Outil d'information</h3>
            </div>

            <p className="text-gray-700 mb-6">
              Une carte interactive avec toutes les parcelles cadastrales
              françaises
            </p>

            <div className="space-y-3">
              <div className="bg-green-50 rounded-lg p-3">
                <h4 className="font-semibold mb-2">📊 Données complètes</h4>
                <p className="text-sm text-gray-600">
                  Population, géorisques, débit internet, constructibilité,
                  transports, PLU, marché de l'emploi, écoles, pollution,
                  criminalité...
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <h4 className="font-semibold mb-2">✅ Sources fiables</h4>
                <p className="text-sm text-gray-600">
                  Données Open Data officielles : cadastre.gouv.fr, INSEE, IGN,
                  GéoRisques, Météo-France, DVF (Demande de Valeur Foncière)...
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <h4 className="font-semibold mb-2">🗺️ Interface intuitive</h4>
                <p className="text-sm text-gray-600">
                  Cliquez sur n'importe quelle parcelle pour accéder
                  instantanément à toutes ses informations dans une interface
                  claire et compréhensible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
