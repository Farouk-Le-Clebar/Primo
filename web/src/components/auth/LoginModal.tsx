import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../requests/AuthRequests";
import { AxiosError } from "axios";
import UserInfo from "../user/UserPreview";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import {BackgroundColors, TextColors}  from "../../utils/colors";

export default function LoginModal({ 
  email,
  onBack,
  onClose,
}: { 
  email: string;
  onBack: () => void;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          localStorage.setItem("token", data.access_token);
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.reload();
          }
          onClose();
        } catch (err) {
          console.error("⚠️ Impossible d'accéder au localStorage :", err);
          return;
        }
      }
      setErrorMessage("");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401 || err.response?.data?.message === "Invalid credentials") {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center"
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
      {/* Text Title and Desc */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-md sm:max-w-lg md:max-w-116 p-6 sm:p-8 md:p-10 text-left animate-fade-in">
        <div>
          <h2 className="text-2xl sm:text-2xl font-UberMoveBold text-gray-800 mb-2">Heureux de vous revoir 👋</h2>
          <p className="text-gray-600 font-UberMoveMedium mb-6 text-sm sm:text-sm">
              Connectez-vous à votre compte Primo pour retrouver vos projets, vos favoris et votre progression.
              Saisissez simplement votre mot de passe ci-dessous.
          </p>

        </div>

        <div className="space-y-3 mt-8">
          <UserInfo email={email} />
        </div>
        {/* Input Password */}
        <div className="space-y-1 mt-5 relative">
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

        {/* Button Connexion */}
        <Button
          onClick={handleConnect}
          disabled={isPending}
          isLoading={isPending}
          textSize="text-md font-medium"
          className={`mt-6`}
          children={<>
            <p>Se connecter</p>
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
    </div>
  );
}
