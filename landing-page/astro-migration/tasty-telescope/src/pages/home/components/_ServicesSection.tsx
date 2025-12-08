import { Code, Sparkles, Check } from "lucide-react";

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="min-h-screen flex flex-col justify-center items-center py-16 md:py-20 bg-linear-to-b from-white via-green-50/30 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Nos <span className="text-green-600">Services</span>
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-sm md:text-base">
            Des solutions adaptées aux particuliers et aux professionnels
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white border border-green-100 rounded-xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="bg-green-100 w-fit p-3 rounded-lg mb-4">
              <Check className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">Gratuit</h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Pour tous les particuliers
            </p>

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                <span className="text-gray-700">
                  Accès illimité à toutes les données
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                <span className="text-gray-700">
                  Carte interactive complète
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                <span className="text-gray-700">Assistant IA basique</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                <span className="text-gray-700 text-sm md:text-base">
                  Site web et application mobile
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-linear-to-br from-green-50 to-white border-2 border-green-500 rounded-xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="bg-green-100 w-fit p-3 rounded-lg mb-4 relative z-10">
              <Code className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 relative z-10">
              API de base
            </h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base relative z-10">
              Pour les développeurs
            </p>

            <ul className="space-y-3 relative z-10">
              <li className="flex items-start gap-2">
                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                <span className="text-gray-700">
                  Accès à toutes nos données
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                <span className="text-gray-700">
                  Données actuelles et fiables
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                <span className="text-gray-700">Documentation complète</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                <span className="text-gray-700 text-sm md:text-base">
                  Support technique
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-green-100 rounded-xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="bg-green-100 w-fit p-3 rounded-lg mb-4">
              <Sparkles className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">API + IA</h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Pour les professionnels
            </p>

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                <span className="text-gray-700 text-sm md:text-base">
                  Tout de l'API de base
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                <span className="text-gray-700 text-sm md:text-base">
                  Accès à notre modèle d'IA
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                <span className="text-gray-700 text-sm md:text-base">
                  Analyses et comparaisons avancées
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                <span className="text-gray-700 text-sm md:text-base">
                  Réponses en langage naturel
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            Notre plateforme reste entièrement gratuite pour les particuliers.
            Les services payants permettent aux professionnels d'intégrer nos
            données et notre IA dans leurs propres applications.
          </p>
        </div>
      </div>
    </section>
  );
}
