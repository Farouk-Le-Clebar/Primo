export default function HeroSection() {
  return (
    <section
      className="h-screen flex flex-col justify-center items-center text-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/src/assets/backgrounds/backgroundWhite.svg')",
      }}
    >
      {/* Optionnel : voile blanc semi-transparent pour la lisibilité */}
      <div className="absolute inset-0 bg-white/60"></div>

      {/* Contenu */}
      <div className="relative z-10">
        <h1 className="text-5xl font-bold mb-6">
          Cherchez moins, <br />
          trouvez plus avec <span className="text-green-600">Primo.</span>
        </h1>
        <p className="text-gray-700 mb-8 max-w-lg mx-auto">
          Une plateforme pensée pour simplifier votre recherche et vous faire gagner du temps.
        </p>
        <div className="flex space-x-4 justify-center">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
            Découvrir
          </button>
          <button className="border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition">
            En savoir plus
          </button>
        </div>
      </div>
    </section>
  );
}
