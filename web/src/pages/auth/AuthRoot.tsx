import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google"; // 👈 Ajout du hook Google

// COMPONENTS
import { checkUserByMail } from "../../requests/UserRequests";
import { loginWithGoogle } from "../../requests/AuthRequests"; // 👈 Ajout de ta nouvelle requête
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import LogoGoogle from "../../assets/logos/LogoGoogle.svg";

export default function AuthRoot() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // 1. Mutation classique (Email check)
  const { mutate: checkEmailMutate, isPending: isCheckingEmail } = useMutation({
    mutationFn: () => checkUserByMail(email),
    onSuccess: (data) => {
      const emailParam = encodeURIComponent(email);
      if (data.exists) {
        navigate(`/auth/login?email=${emailParam}`);
      } else {
        navigate(`/auth/register?email=${emailParam}`);
      }
    },
    onError: () => {
      setErrorMessage("Une erreur est survenue lors de la vérification.");
    },
  });

  // 2. NOUVELLE MUTATION : Connexion Google
  const { mutate: googleMutate, isPending: isGoogleLoading } = useMutation({
    mutationFn: (token: string) => loginWithGoogle(token),
    onSuccess: (data) => {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("token", data.access_token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // 👈 La magie du isNewUser calculé dans ton backend !
        if (data.isNewUser) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard", { state: { welcome: true } });
        }
      }
    },
    onError: () => {
      setErrorMessage("Échec de la connexion avec Google. Veuillez réessayer.");
    },
  });

  // 3. Fonction déclenchée par le clic sur le bouton Google
  const handleGoogleConnect = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setErrorMessage("");
      // On envoie le token récupéré à notre backend NestJS
      googleMutate(tokenResponse.access_token);
    },
    onError: () => {
      setErrorMessage("La popup Google a été fermée ou a échoué.");
    },
  });

  const handleContinue = () => {
    if (!email) {
      setErrorMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }
    setErrorMessage("");
    checkEmailMutate();
  };

  return (
    <div className="animate-fade-in-up">
      <div className="space-y-1">
        
        <div className="flex justify-between items-center">
          <h3 className="font-inter font-medium text-base text-gray-800">Adresse e-mail</h3>
          
          <div className="relative group cursor-help flex items-center">
            <div className="flex items-center justify-center w-[18px] h-[18px] bg-black text-white rounded-full text-[11px] font-bold">
              ?
            </div>
            
            <div className="absolute bottom-full right-0 mb-2 hidden w-56 p-3 text-xs text-white bg-gray-900 rounded-lg shadow-lg group-hover:block z-20 animate-fade-in">
              Saisissez votre e-mail. Nous vous redirigerons automatiquement vers la connexion ou la création de compte.
              <div className="absolute top-full right-[5px] -mt-[1px] border-[5px] border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>

        <Input
          type="email"
          placeholder="Exemple@hotmail.com"
          onChange={setEmail}
          value={email}
          focusColor="focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleContinue();
          }}
        />
      </div>

      {errorMessage && (
        <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
      )}

      <div className="mt-6 space-y-4">
        <Button
          onClick={handleContinue}
          disabled={isCheckingEmail || isGoogleLoading}
          isLoading={isCheckingEmail}
          textSize="font-inter font-medium text-base"
          backgroundColor="bg-black"
          backgroundHoverColor="hover:bg-gray-800"
          className="w-full"
        >
          Continuer
        </Button>

        <button
          onClick={() => handleGoogleConnect()}
          disabled={isCheckingEmail || isGoogleLoading}
          className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition w-full disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <img src={LogoGoogle} alt="Google" className="h-5 w-5 mr-3" />
          <span className="font-inter font-medium text-base">
            {isGoogleLoading ? "Connexion en cours..." : "Se connecter avec Google"}
          </span>
        </button>
      </div>
    </div>
  );
}