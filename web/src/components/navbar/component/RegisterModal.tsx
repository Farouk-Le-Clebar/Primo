import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../../requests/AuthRequests";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterModal({ 
  onClose,
  email: initialEmail,
}: { 
  onClose: () => void;
  email: string;
}) {
  const [email, setEmail] = useState(initialEmail || "");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthColors = ["bg-red-500", "bg-yellow-500", "bg-green-500"];

  const { mutate, isPending } = useMutation({
    mutationFn: () => register(email, password),
    onSuccess: (data) => {
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          localStorage.setItem("token", data.access_token);
        } catch (err) {
          console.error("⚠️ Impossible d'accéder au localStorage :", err);
          return;
        }
      }
      setErrorMessage("");
      onClose();
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        if (
          err.response?.status === 401 ||
          err.response?.data?.message === "Invalid credentials"
        ) {
          setErrorMessage("Le mot de passe est incorrect. Veuillez réessayer.");
        } else {
          setErrorMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
        }
      } else {
        setErrorMessage("Erreur inattendue. Merci de réessayer.");
      }
    },
  });

  const handleConnect = () => {
    if (!password) {
      setErrorMessage("Veuillez entrer votre mot de passe.");
      return;
    }
    mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 md:p-10 text-left animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-UberMoveBold text-gray-800 mb-2">
          Créez votre compte Primo 🌱
        </h2>

        <p className="text-gray-600 font-UberMoveMedium mb-6 text-sm sm:text-base">
          Il ne vous reste plus qu’une étape avant de rejoindre l’aventure Primo.
          Entrez simplement votre mot de passe deux fois pour sécuriser votre compte et commencer votre expérience.
        </p>

        {/* Input Email */}
        <div className="space-y-1 mt-4">
          <h3 className="font-UberMoveMedium text-lg">Email</h3>
          <input
            type="email"
            placeholder="Entrez votre Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Input Password */}
        <div className="space-y-1 mt-4 relative">
          <h3 className="font-UberMoveMedium text-lg">Mot de passe</h3>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Barre horizontale de progression */}
          <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                strength > 0 ? strengthColors[strength - 1] : "bg-gray-200"
              }`}
              style={{ width: `${(strength / 3) * 100}%` }}
            ></div>
          </div>

          {/* Liste des critères */}
          <ul className="text-xs text-gray-600 mt-2 space-y-1">
            <li className={password.length >= 8 ? "text-green-600" : ""}>
              • Minimum 8 caractères
            </li>
            <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
              • 1 majuscule
            </li>
            <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}>
              • 1 caractère spécial
            </li>
          </ul>
        </div>

        {/* Confirm Button */}
        <div className="space-y-1 mt-8">
          <button
            onClick={handleConnect}
            disabled={isPending}
            className={`w-full pl-4 pr-6 py-3 rounded-lg shadow-md transition-all duration-200 ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
            }`}
          >
            {isPending ? "Connexion en cours..." : "Créez votre compte"}
          </button>

          {errorMessage && (
            <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
