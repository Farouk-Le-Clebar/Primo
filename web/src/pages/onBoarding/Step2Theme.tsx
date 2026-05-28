import Button from "../../ui/Button";
import { Check } from "lucide-react";
import LogoPrimoBlack from "../../assets/logos/logoPrimoBlack.svg";
import LogoPrimoWhite from "../../assets/logos/logoPrimoWhite.svg";
import { useTheme } from "../../context/ThemeProvider";

type Props = {
    theme: string;
    setTheme: (theme: string) => void;
    onNext: () => void;
    onBack: () => void;
};

export default function Step2Theme({ theme, setTheme, onNext, onBack }: Props) {
    const { setTheme: setAppTheme } = useTheme();

    const handleThemeSelection = (selectedTheme: "light" | "dark") => {
        setTheme(selectedTheme);
        setAppTheme(selectedTheme);
    };

    return (
        <div className="flex flex-col items-center text-center max-w-lg w-full animate-fade-in">
            <h1 className="font-inter font-medium text-[42px] text-black dark:text-white mb-4 transition-colors">
                Mode d'affichage
            </h1>
          
            <p className="font-inter font-base text-lg text-[#949496] dark:text-gray-400 mb-10 transition-colors">
                Personnalisez votre interface pour un confort visuel optimal.
            </p>

            <div className="flex gap-6 mb-10 w-full justify-center">
                <button
                    onClick={() => handleThemeSelection("light")}
                    className={`relative w-48 h-32 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                        theme === "light" 
                            ? "border-2 border-black dark:border-white ring-4 ring-gray-100 dark:ring-white/10 bg-white" 
                            : "border-2 border-gray-200 dark:border-[#262626] bg-white hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                >
                    {theme === "light" && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center transition-colors">
                            <Check className="w-4 h-4 text-white dark:text-black" strokeWidth={3} />
                        </div>
                    )}
                    <img src={LogoPrimoBlack} alt="Light Mode" className="w-10 h-10" />
                    <span className="font-inter font-medium text-black">Clair</span>
                </button>

                <button
                    onClick={() => handleThemeSelection("dark")}
                    className={`relative w-48 h-32 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                        theme === "dark" 
                            ? "border-2 border-black dark:border-white ring-4 ring-gray-100 dark:ring-white/10 bg-[#16161A]" 
                            : "border-2 border-gray-200 dark:border-[#262626] bg-[#16161A] hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                >
                    {theme === "dark" && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center transition-colors">
                            <Check className="w-4 h-4 text-white dark:text-black" strokeWidth={3} />
                        </div>
                    )}
                    <img src={LogoPrimoWhite} alt="Dark Mode" className="w-10 h-10 invert brightness-0" />
                    <span className="font-inter font-medium text-white">Sombre</span>
                </button>
            </div>

            <Button
                onClick={onNext}
                backgroundColor="bg-black dark:bg-white"
                backgroundHoverColor="hover:bg-gray-800 dark:hover:bg-white/80"
                textColor="text-white dark:text-black"
                textSize="font-inter font-medium text-base dark:hover:text-black"
                className="w-full rounded-lg py-3 transition-colors"
            >
                Suivant
            </Button>
            <Button
                onClick={onBack}
                height="h-7"
                textSize="font-inter font-medium text-base"
                backgroundColor="bg-transparent dark:bg-transparent"
                backgroundHoverColor="hover:bg-transparent dark:hover:bg-transparent"
                textColor="text-black dark:text-gray-300"
                textHoverColor="hover:text-black dark:hover:text-white"
                shadowHover="hover:shadow-none dark:hover:shadow-none"
                className="w-full hover:underline hover:underline-offset-4 disabled:bg-transparent mt-2 transition-colors"
            >
                Retour
            </Button>
        </div>
    );
}