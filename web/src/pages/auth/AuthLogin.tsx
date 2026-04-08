import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";

// COMPONENTS
import UserInfo from "../../components/user/UserPreview";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { login } from "../../requests/AuthRequests";

export default function AuthLogin() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/auth");
    }
  }, [email, navigate]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          localStorage.setItem("token", data.access_token);
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          navigate("/dashboard", { state: { welcome: true } });

        } catch (err) {
          console.error("⚠️ Impossible d'accéder au localStorage :", err);
        }
      }
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

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (document.activeElement?.tagName === "BUTTON") {
          return;
        }
        
        e.preventDefault();
        handleConnect();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [password, email]);


  return (
    <>
      <div className="animate-fade-in flex flex-col space-y-6">
        <UserInfo email={email} />
        
        <div className="space-y-1">
          <h3 className="font-inter font-medium text-sm text-gray-800">Adresse e-mail</h3>
          <Input
            type="email"
            value={email}
            onChange={() => {}}
            className="text-gray-500 cursor-not-allowed opacity-70"
            placeholder=""
          />
        </div>

        <div className="space-y-1 relative">
          <h3 className="font-inter font-medium text-sm text-gray-800">Mot de passe</h3>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              onChange={setPassword}
              value={password}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
          )}
        </div>

        <div className="flex flex-col gap-4 pt-2">
          <Button
            onClick={handleConnect}
            disabled={isPending}
            isLoading={isPending}
            textSize="font-inter font-medium text-base"
            backgroundColor="bg-black"
            backgroundHoverColor="hover:bg-gray-800"
            className="w-full"
          >
            Continuer
          </Button>

          <Button
            onClick={() => navigate("/auth")}
            height="h-7"
            textSize="font-inter font-medium text-base"
            backgroundColor="bg-transparent"
            backgroundHoverColor="hover:bg-transparent"
            textColor="text-black"
            textHoverColor="hover:text-black"
            shadowHover="hover:shadow-none"
            className="w-full hover:underline hover:underline-offset-4 disabled:bg-transparent"
          >
            Retour
          </Button>
        </div>
      </div>
    </>
  );
}