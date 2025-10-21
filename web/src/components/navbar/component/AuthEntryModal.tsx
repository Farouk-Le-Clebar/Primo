import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { checkUserByMail } from "../../../requests/UserRequests";
import LogoFacebook from "../../../assets/logos/LogoFacebook.svg";
import LogoGoogle from "../../../assets/logos/LogoGoogle.svg";
import LogoApple from "../../../assets/logos/LogoApple.svg";

export default function AuthEntryModal({ 
  onClose, 
  setEmail,
  onEmailChecked 
}: { 
  onClose: () => void;  
  setEmail: (value: string) => void;
  onEmailChecked: (exists: boolean) => void; }) 
{
  const [localEmail, setLocalEmail] = useState("");

  const { mutate, isPending, isError, isSuccess, error } = useMutation({
    mutationFn: () => checkUserByMail(localEmail),
    onSuccess: (data) => {
      if (data.exists) {
        onEmailChecked(data.exists);
      } else {
        onEmailChecked(data.exists);
      }
      setEmail(localEmail); 

    },
    onError: (err) => {
      console.error("❌ Erreur de connexion :", err);
    },
  });

  const handleConnect = () => {
    if (!localEmail) {
      alert("Veuillez entrer votre adresse e-mail");
      return;
    }
    mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 md:p-10 text-left animate-fade-in">
        {/* Titre et desc */}
        <h2 className="text-2xl sm:text-3xl font-UberMoveBold text-gray-800 mb-2">Bienvenue sur Primo.</h2>

        <p className="text-gray-600 font-UberMoveMedium mb-6 text-sm sm:text-base">
          Pas encore de compte ? Vous pouvez vous connecter directement avec Facebook, Apple ou Google, 
          ou bien simplement saisir votre adresse e-mail pour commencer la création de votre compte.
        </p>

        {/* Boutons sociaux */}
        <div className="space-y-4">
          <button onClick={onClose} className="flex items-center justify-start bg-blue-600 text-white pl-4 px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full">
            <img src={LogoFacebook} alt="icone" className="h-6 w-6 mr-2" />
            <span className="font-UberMoveMedium text-base sm:text-lg">Se connecter avec Facebook</span>
          </button>

          <button onClick={onClose} className="flex items-center justify-start bg-gray-100 text-gray-800 pl-4 pr-6 py-3 rounded-lg shadow hover:shadow-md hover:bg-gray-200 transition w-full">
            <img src={LogoGoogle} alt="icone" className="h-6 w-6 mr-2" />
            <span className="font-UberMoveMedium text-base sm:text-lg">Se connecter avec Google</span>
          </button>

          <button onClick={onClose} className="flex items-center justify-start bg-black text-white pl-4 px-6 py-3 rounded-lg hover:bg-gray-800 transition w-full">
            <img src={LogoApple} alt="icone" className="h-6 w-6 mr-2" />
            <span className="font-UberMoveMedium text-base sm:text-lg">Se connecter avec Apple</span>
          </button>
        </div>

        {/* Champ e-mail */}
        <div className="space-y-3 mt-8">
          <h3 className="font-UberMoveMedium text-lg">Ou entrez votre adresse e-mail  </h3>
          <input
            type="email"
            placeholder="Entrez votre adresse e-mail"
            value={localEmail}
            onChange={(e) => setLocalEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={handleConnect}
            disabled={isPending}
            className={`w-full pl-4 pr-6 py-3 rounded-lg shadow-md transition-all duration-200 ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
            }`}
          >
            {isPending ? "Recherche en cours..." : "Continuer"}
          </button>

          {isError && <p className="text-red-600 text-sm mt-2">Une erreur est survenue ou l’adresse e-mail est invalide.</p>}
        </div>
      </div>
    </div>
  );
}
