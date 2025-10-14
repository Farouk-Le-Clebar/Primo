export default function FeaturesSection() {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-5xl font-bold mb-6">
        Cherchez moins, <br />
        trouvez plus avec <span className="text-blue-600">Primo</span>.
      </h1>
      <p className="text-gray-700 mb-8 max-w-lg">
        Une plateforme pensée pour simplifier votre recherche et vous faire gagner du temps.
      </p>
      <div className="flex space-x-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Découvrir
        </button>
        <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition">
          En savoir plus
        </button>
      </div>
    </section>
  );
}