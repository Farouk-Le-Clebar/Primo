import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";

// COMPONENTS
import { checkUserByMail } from "../../requests/UserRequests";
import { loginWithGoogle } from "../../requests/AuthRequests";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import LogoGoogle from "../../assets/logos/LogoGoogle.svg";

export default function AuthRoot() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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

  const { mutate: googleMutate, isPending: isGoogleLoading } = useMutation({
    mutationFn: (token: string) => loginWithGoogle(token),
    onSuccess: (data) => {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("token", data.access_token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        navigate("/dashboard", { state: { welcome: true } });
        
        // if (data.isNewUser) {
        //   navigate("/onboarding");
        // } else {
        //   navigate("/dashboard", { state: { welcome: true } });
        // }
      }
    },
    onError: () => {
      setErrorMessage("Échec de la connexion avec Google. Veuillez réessayer.");
    },
  });

  const handleGoogleConnect = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setErrorMessage("");
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
          <h3 className="font-inter font-medium text-base text-gray-800 dark:text-white">Adresse e-mail</h3>

          <div className="relative group cursor-help flex items-center">
            <div className="flex items-center justify-center w-[18px] h-[18px] bg-black dark:bg-[#171717] dark:border dark:border-[#262626] text-white dark:text-gray-300 rounded-full text-[11px] font-bold transition-colors">
              ?
            </div>

            <div className="absolute bottom-full right-0 mb-2 hidden w-56 p-3 text-xs text-white dark:text-gray-200 bg-gray-900 dark:bg-[#171717] dark:border dark:border-[#262626] rounded-lg shadow-lg group-hover:block z-20 animate-fade-in">
              Saisissez votre e-mail. Nous vous redirigerons automatiquement vers la connexion ou la création de compte.
              <div className="absolute top-full right-[5px] -mt-[1px] border-[5px] border-transparent border-t-gray-900 dark:border-t-[#262626]"></div>
            </div>
          </div>
        </div>

        <Input
          type="email"
          placeholder="Exemple@hotmail.com"
          onChange={setEmail}
          value={email}
          focusColor="focus:outline-none dark:focus:border-white/20"
          className="dark:bg-[#171717] dark:border-[#262626] dark:text-white dark:placeholder-gray-500 transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleContinue();
          }}
        />
      </div>
      <div className="flex justify-start mt-2">
        <button
          className="cursor-pointer text-sm text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:underline transition-colors"
          onClick={() => navigate("/auth/forgot-password")}
        >
          Mot de passe oublié ?
        </button>
      </div>

      {errorMessage && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-2">{errorMessage}</p>
      )}
      <div className="mt-6 space-y-4">
        <Button
          onClick={handleContinue}
          disabled={isCheckingEmail || isGoogleLoading}
          isLoading={isCheckingEmail}
          textSize="font-inter font-medium text-base dark:text-black dark:hover:text-black"
          backgroundColor="bg-black dark:bg-white"
          backgroundHoverColor="hover:bg-gray-800 dark:hover:bg-white/80"
          className="w-full transition-colors"
        >
          Continuer
        </Button>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200 dark:bg-[#262626]"></div>
          <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500 font-inter text-xs font-medium">OU</span>
          <div className="flex-grow h-px bg-gray-200 dark:bg-[#262626]"></div>
        </div>
        
        <button
          onClick={() => handleGoogleConnect()}
          disabled={isCheckingEmail || isGoogleLoading}
          className="flex cursor-pointer items-center justify-center bg-black dark:bg-[#171717] text-white dark:text-white border border-transparent dark:border-[#262626] px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-[#262626] transition-colors w-full disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <img src={LogoGoogle} alt="Google" className="h-5 w-5 mr-3" />
          <span className="font-inter font-medium text-base">
            {isGoogleLoading ? "Connexion en cours..." : "Se connecter avec Google"}
          </span>
        </button>

        <div className="flex items-center justify-center w-full mt-7">
          <p className="font-inter font-regular text-[#99A1AF] dark:text-gray-500 text-sm text-center w-80">
            En continuant, vous acceptez nos{" "}
            <Link 
              to="/conditions" 
              className="underline text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              Conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link 
              to="/confidentialite" 
              className="underline text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              Politique de confidentialité
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}