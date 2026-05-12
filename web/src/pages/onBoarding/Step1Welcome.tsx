import Button from "../../ui/Button";
import LogoPrimo from "../../assets/logos/logoPrimoBlack.svg";

type Props = {
  onNext: () => void;
};

export default function Step1Welcome({ onNext }: Props) {
  return (
    <div className="flex flex-col items-center text-center w-full animate-fade-in">
        {/* dark:invert permet de passer le logo noir en blanc */}
        <img src={LogoPrimo} alt="Primo Logo" className="h-[70px] w-[70px] dark:invert transition-colors" />
      
        <h1 className="font-inter font-medium text-5xl text-black dark:text-white mb-4 transition-colors">
            Bienvenue sur Primo
        </h1>
      
        <p className="font-inter font-base text-lg text-[#949496] dark:text-gray-400 mb-10 transition-colors">
            Primo est l'outil intuitif d'analyse des parcelles foncières françaises.
        </p>
      
        <Button
            onClick={onNext}
            backgroundColor="bg-black dark:bg-white"
            backgroundHoverColor="hover:bg-gray-800 dark:hover:bg-white/80"
            textColor="text-white dark:text-black"
            textSize="font-inter font-medium text-base dark:hover:text-black"
            className="w-full max-w-sm rounded-lg py-3 mx-auto transition-colors"
            >
            Commencer
        </Button>
    </div>
  );
}