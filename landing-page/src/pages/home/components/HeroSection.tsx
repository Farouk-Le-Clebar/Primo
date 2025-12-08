import { ArrowUpRight } from "lucide-react";
import backgroundWhite from "../../../assets/backgrounds/backgroundWhite.svg";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="h-screen flex flex-col justify-center items-center text-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${backgroundWhite})`,
      }}
    >
      <div className="absolute inset-0 bg-white/60"></div>

      <div className="relative z-10">
        <h1 className="text-5xl font-bold mb-6">
          Cherchez moins, <br />
          trouvez plus avec <span className="text-green-600">Primo.</span>
        </h1>
        <p className="text-gray-700 mb-8 max-w-lg mx-auto">
          Une plateforme pensée pour simplifier votre recherche et vous faire
          gagner du temps.
        </p>
        <div className="flex space-x-4 justify-center">
          <a
            href="https://app.primo-data.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            Découvrir Primo
            <ArrowUpRight size={18} className="mt-px" />
          </a>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdJmNDDhunKox0XS8WZWfG2Wof7ue87fxCvxv_ch98r98cA-g/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition"
          >
            Accéder à la beta
          </a>
        </div>
      </div>
    </section>
  );
}
