import Button from "../../ui/Button";
import LogoPrimo from "../../assets/logos/logoPrimoBlack.svg";

type Props = {
  onNext: () => void;
};

export default function Step1Welcome({ onNext }: Props) {
  return (
    <div className="flex flex-col items-center text-center w-full animate-fade-in">
        <img src={LogoPrimo} alt="Primo Logo" className="h-[70px] w-[70px]" />
      
        <h1 className="font-inter font-medium text-5xl text-black mb-4">
            Bienvenue sur Primo
        </h1>
      
        <p className="font-inter font-base text-lg text-[#949496] text-base mb-10">
            Primo est l'outil intuitif d'analyse des parcelles foncières françaises.
        </p>
      
        <Button
            onClick={onNext}
            backgroundColor="bg-black"
            backgroundHoverColor="hover:bg-gray-800"
            textColor="text-white"
            textSize="font-inter font-medium text-base"
            className="w-full max-w-sm rounded-lg py-3 mx-auto"
            >
            Commencer
        </Button>

    </div>
  );
}