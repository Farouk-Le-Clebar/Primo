import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../../requests/AuthRequests";
import { AxiosError } from "axios";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

import Button from "../../../ui/Button";
import Input from "../../../ui/Input";
import {BackgroundColors, TextColors}  from "../../../utils/colors";

export default function RegisterModal({ 
  onClose,
  email: initialEmail,
  onBack,
}: { 
  onClose: () => void;
  email: string;
  onBack: () => void;
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
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-md sm:max-w-lg md:max-w-116 p-6 sm:p-8 md:p-10 text-left animate-fade-in">
        <h2 className="text-2xl sm:text-2xl font-UberMoveBold text-gray-800 mb-2">
          Créez votre compte Primo 🌱
        </h2>

        <p className="text-gray-600 font-UberMoveMedium mb-6 text-sm sm:text-sm">
          Il ne vous reste plus qu’une étape avant de rejoindre l’aventure Primo.
          Entrez simplement votre mot de passe deux fois pour sécuriser votre compte et commencer votre expérience.
        </p>

        {/* Input Email */}
        <div className="space-y-1 mt-4">
          <h3 className="font-UberMoveMedium text-sm">Email</h3>
            <Input
              type="email"
              placeholder="Entrez votre mot de passe"
              onChange={setEmail}
              value={email}
              className=""
            />
        </div>

        {/* Input Password */}
        <div className="space-y-1 mt-4 relative">
          <h3 className="font-UberMoveMedium text-sm">Mot de passe</h3>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Entrez votre mot de passe"
              onChange={setPassword}
              value={password}
              className=""
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Horizontal progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                strength > 0 ? strengthColors[strength - 1] : "bg-gray-200"
              }`}
              style={{ width: `${(strength / 3) * 100}%` }}
            ></div>
          </div>

          {/* List of criteria */}
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


        {/* Button Connexion */}
        <Button
          onClick={handleConnect}
          disabled={isPending}
          isLoading={isPending}
          textSize="text-md font-medium"
          className={`mt-6`}
          children={<>
            <p>Créez votre compte</p>
          </>
          }
        />

        {/* Button Back */}
        <Button
          onClick={onBack}
          disabled={isPending}
          isLoading={isPending}
          className={`mt-3`}
          textSize="text-md font-normal"
          textColor={TextColors.black}
          backgroundColor={BackgroundColors.gray}
          backgroundHoverColor={BackgroundColors.grayHover}
          children={<>
                      <ArrowLeft
                        size={24}
                        className="text-black opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:stroke-2"
                      />
                      <p className="mr-9">Retour</p>
                    </>
          }
        />

        {/* Text Error */}
          {errorMessage && (
            <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
          )}
      </div>
    </div>
  );
}
