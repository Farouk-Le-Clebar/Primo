import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { checkUserByMail } from "../../requests/UserRequests";
import LogoFacebook from "../../assets/logos/LogoFacebook.svg";
import LogoGoogle from "../../assets/logos/LogoGoogle.svg";
import LogoApple from "../../assets/logos/LogoApple.svg";

{/* Modified Components */}
import Button from "../../ui/Button";
import Input from "../../ui/Input";

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
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate, isPending } = useMutation({
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
      setErrorMessage("❌ Veuillez entrer votre adresse e-mail");
      return;
    }
    mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleConnect();
        }
        if (e.key === "Escape") {
          onClose();
        }
      }}
      tabIndex={0}
    >

      <div className="relative z-10 bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] max-w-md sm:max-w-lg md:max-w-116 p-6 sm:p-8 md:p-10 text-left animate-fade-in">
        {/* Title and desc */}
        <h2 className="text-2xl sm:text-2xl font-UberMoveBold text-gray-800 mb-2">Bienvenue sur Primo</h2>

        <p className="text-gray-600 font-UberMoveMedium mb-6 text-sm sm:text-sm">
          Pas encore de compte ? Vous pouvez vous connecter directement avec Facebook, Apple ou Google, 
          ou bien simplement saisir votre adresse e-mail pour commencer la création de votre compte.
        </p>

        {/* Buttons Social */}
        <div className="space-y-4">
          <button onClick={onClose} className="flex items-center justify-start bg-blue-600 text-white pl-4 px-6 py-2.5 rounded-lg hover:bg-blue-700 transition w-full">
            <img src={LogoFacebook} alt="icone" className="h-6 w-6 mr-2" />
            <span className="font-UberMoveMedium text-base sm:text-sm">Se connecter avec Facebook</span>
          </button>

          <button onClick={onClose} className="flex items-center justify-start bg-gray-100 text-gray-800 pl-4 pr-6 py-2.5 rounded-lg shadow hover:shadow-md hover:bg-gray-200 transition w-full">
            <img src={LogoGoogle} alt="icone" className="h-6 w-6 mr-2" />
            <span className="font-UberMoveMedium text-base sm:text-sm">Se connecter avec Google</span>
          </button>

          <button onClick={onClose} className="flex items-center justify-start bg-black text-white pl-4 px-6 py-2.5 rounded-lg hover:bg-gray-800 transition w-full">
            <img src={LogoApple} alt="icone" className="h-6 w-6 mr-2" />
            <span className="font-UberMoveMedium text-base sm:text-sm">Se connecter avec Apple</span>
          </button>
        </div>

        {/* Input Email */}
        <div className="space-y-1 mt-8">
          <h3 className="font-UberMoveMedium text-sm">Ou entrez votre adresse e-mail  </h3>
          <Input
            type="email"
            placeholder="Entrez votre adresse e-mail"
            onChange={setLocalEmail}
            value={localEmail}
            className=""
          />

        {/* Button Connexion */}
        <Button
          onClick={handleConnect}
          disabled={isPending}
          isLoading={isPending}
          textSize="text-md font-medium"
          className={`mt-2`}
          children={<>
            <p>Continuer</p>
          </>
          }
        />

        {/* Text Error */}
        {errorMessage && (
          <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
        )}
        </div>
      </div>
    </div>
  );
}
