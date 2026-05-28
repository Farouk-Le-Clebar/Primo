import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";

// COMPONENTS
import { register } from "../../requests/AuthRequests";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

export default function AuthRegister() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/auth");
    }
  }, [email, navigate]);

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthColors = ["bg-red-500", "bg-yellow-500", "bg-green-500"];

  const { mutate, isPending } = useMutation({
    mutationFn: () => register(email, firstName, surName, password),
    onSuccess: () => {
        navigate("/auth/register/verify", { state: { email } });
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        setErrorMessage(
          err.response?.data?.message || "Une erreur est survenue lors de la création de votre compte."
        );
      } else {
        setErrorMessage("Erreur inattendue. Merci de réessayer.");
      }
    },
  });

  const handleRegister = () => {
    if (!firstName || !surName || !password) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }
    if (strength < 3) {
      setErrorMessage("Votre mot de passe ne respecte pas les critères de sécurité.");
      return;
    }
    mutate();
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (document.activeElement?.tagName === "BUTTON") {
          return;
        }
        e.preventDefault();
        handleRegister();
      }
    };
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [firstName, surName, password, email, strength]);

  return (
    <>
      <div className="animate-fade-in flex flex-col space-y-5">
        <div className="space-y-1">
          <h3 className="font-inter font-medium text-sm text-gray-800 dark:text-white transition-colors">Adresse e-mail</h3>
          <Input
            type="email"
            value={email}
            onChange={() => { }}
            className="text-gray-500 cursor-not-allowed opacity-70 dark:bg-[#171717] dark:border-[#262626] dark:text-gray-500 transition-colors"
            placeholder=""
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-1">
            <h3 className="font-inter font-medium text-sm text-gray-800 dark:text-white transition-colors">Prénom</h3>
            <Input
              type="text"
              placeholder="Jean"
              onChange={setFirstName}
              value={firstName}
              focusColor="focus:outline-none dark:focus:border-white/20"
              className="dark:bg-[#171717] dark:border-[#262626] dark:text-white dark:placeholder-gray-500 transition-colors"
            />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-inter font-medium text-sm text-gray-800 dark:text-white transition-colors">Nom</h3>
            <Input
              type="text"
              placeholder="Dupont"
              onChange={setSurName}
              value={surName}
              focusColor="focus:outline-none dark:focus:border-white/20"
              className="dark:bg-[#171717] dark:border-[#262626] dark:text-white dark:placeholder-gray-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1 relative">
          <h3 className="font-inter font-medium text-sm text-gray-800 dark:text-white transition-colors">Mot de passe</h3>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              onChange={setPassword}
              value={password}
              focusColor="focus:outline-none dark:focus:border-white/20"
              className="pr-10 dark:bg-[#171717] dark:border-[#262626] dark:text-white dark:placeholder-gray-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="w-full h-1.5 bg-gray-200 dark:bg-[#262626] rounded-full mt-3 overflow-hidden transition-colors">
            <div
              className={`h-full transition-all duration-300 rounded-full ${strength > 0 ? strengthColors[strength - 1] : "bg-transparent"
                }`}
              style={{ width: `${(strength / 3) * 100}%` }}
            ></div>
          </div>

          <ul className="text-xs font-inter font-medium mt-2 space-y-1">
            <li className={password.length >= 8 ? "text-green-600 dark:text-green-500 transition-colors" : "text-gray-500 dark:text-gray-400 transition-colors"}>
              • Minimum 8 caractères
            </li>
            <li className={/[A-Z]/.test(password) ? "text-green-600 dark:text-green-500 transition-colors" : "text-gray-500 dark:text-gray-400 transition-colors"}>
              • 1 majuscule
            </li>
            <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-600 dark:text-green-500 transition-colors" : "text-gray-500 dark:text-gray-400 transition-colors"}>
              • 1 caractère spécial
            </li>
          </ul>

          {errorMessage && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-2 transition-colors">{errorMessage}</p>
          )}
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <Button
            onClick={handleRegister}
            disabled={isPending}
            isLoading={isPending}
            textSize="font-inter font-medium text-base dark:text-black dark:hover:text-black"
            backgroundColor="bg-black dark:bg-white"
            backgroundHoverColor="hover:bg-gray-800 dark:hover:bg-white/80"
            className="w-full transition-colors"
          >
            Continuer
          </Button>

          <Button
            onClick={() => navigate("/auth")}
            height="h-7"
            textSize="font-inter font-medium text-base"
            backgroundColor="bg-transparent dark:bg-transparent"
            backgroundHoverColor="hover:bg-transparent dark:hover:bg-transparent"
            textColor="text-black dark:text-gray-300"
            textHoverColor="hover:text-black dark:hover:text-white"
            shadowHover="hover:shadow-none dark:hover:shadow-none"
            className="w-full hover:underline hover:underline-offset-4 disabled:bg-transparent transition-colors"
          >
            Retour
          </Button>
        </div>
      </div>
    </>
  );
}