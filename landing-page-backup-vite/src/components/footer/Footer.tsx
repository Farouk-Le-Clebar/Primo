import { Linkedin, Mail } from "lucide-react";
import Logo from "../../assets/logos/logoPrimoWhite.svg";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={Logo} alt="Logo Primo" className="h-8 w-8" />
              <span className="text-2xl font-bold">Primo.</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              La plateforme qui centralise toutes les informations sur une
              parcelle cadastrale en un clic. Gratuit, accessible et alimenté
              par l'IA.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/primo-data-app/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-green-600 transition"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:contact@primo-data.fr"
                className="bg-gray-800 p-2 rounded-lg hover:bg-green-600 transition"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="text-gray-400 hover:text-green-500 transition"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-400 hover:text-green-500 transition"
                >
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-green-500 transition"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-green-500 transition"
                >
                  À propos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://app.primo-data.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition"
                >
                  Accéder à l'application
                </a>
              </li>
              <li>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdJmNDDhunKox0XS8WZWfG2Wof7ue87fxCvxv_ch98r98cA-g/viewform?usp=header"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition"
                >
                  Rejoindre la beta
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/primo-data-app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Primo. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition"
              >
                Mentions légales
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition"
              >
                Confidentialité
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition"
              >
                CGU
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
