import Button from "../../ui/Button";

type Props = {
    publicActivity: boolean;
    setPublicActivity: (val: boolean) => void;
    newsletter: boolean;
    setNewsletter: (val: boolean) => void;
    onNext: () => void;
    onBack: () => void;
};

export default function Step3Settings({
    publicActivity,
    setPublicActivity,
    newsletter,
    setNewsletter,
    onNext,
    onBack
}: Props) {
    return (
        <div className="flex flex-col items-center text-center max-w-lg w-full animate-fade-in">
            <h1 className="font-inter font-medium text-[42px] text-black mb-4">
                Préférences
            </h1>
          
            <p className="font-inter font-base text-lg text-[#949496] mb-10">
                Configurez vos notifications et alertes.
            </p>

            <div className="w-full space-y-4 mb-10 text-left">
                <div className="flex items-center justify-between border border-gray-100 bg-[#FAFAFA] rounded-xl p-5">
                    <div>
                        <p className="font-inter font-medium text-[15px] text-black mb-1">Notifications</p>
                        <p className="font-inter text-[13px] text-[#949496]">Recevoir des alertes sur vos parcelles</p>
                    </div>
                    <button
                        onClick={() => {}}
                        className="relative inline-flex h-7 w-[44px] items-center rounded-full bg-black transition-colors focus:outline-none"
                    >
                        <span className="inline-block h-[22px] w-[22px] translate-x-[18px] transform rounded-full bg-white transition-transform" />
                    </button>
                </div>

                <div className="flex items-center justify-between border border-gray-100 bg-[#FAFAFA] rounded-xl p-5">
                    <div>
                        <p className="font-inter font-medium text-[15px] text-black mb-1">Rapports hebdomadaires</p>
                        <p className="font-inter text-[13px] text-[#949496]">Recevoir les e-mails des nouveautés Primo</p>
                    </div>
                    <button
                        onClick={() => setNewsletter(!newsletter)}
                        className={`relative inline-flex h-7 w-[44px] items-center rounded-full transition-colors focus:outline-none ${
                            newsletter ? "bg-black" : "bg-[#E5E5EA]"
                        }`}
                    >
                        <span className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white transition-transform ${
                            newsletter ? "translate-x-[18px]" : "translate-x-[2px]"
                        }`} />
                    </button>
                </div>

                <div className="flex items-center justify-between border border-gray-100 bg-[#FAFAFA] rounded-xl p-5">
                    <div>
                        <p className="font-inter font-medium text-[15px] text-black mb-1">Activité</p>
                        <p className="font-inter text-[13px] text-[#949496]">Afficher mon activité aux autres</p>
                    </div>
                    <button
                        onClick={() => setPublicActivity(!publicActivity)}
                        className={`relative inline-flex h-7 w-[44px] items-center rounded-full transition-colors focus:outline-none ${
                            publicActivity ? "bg-black" : "bg-[#E5E5EA]"
                        }`}
                    >
                        <span className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white transition-transform ${
                            publicActivity ? "translate-x-[18px]" : "translate-x-[2px]"
                        }`} />
                    </button>
                </div>
            </div>

            <Button
                onClick={onNext}
                backgroundColor="bg-black"
                backgroundHoverColor="hover:bg-gray-800"
                textColor="text-white"
                textSize="font-inter font-medium text-base"
                className="w-full rounded-lg py-3"
            >
                Suivant
            </Button>
            <Button
                onClick={onBack}
                height="h-7"
                textSize="font-inter font-medium text-base"
                backgroundColor="bg-transparent"
                backgroundHoverColor="hover:bg-transparent"
                textColor="text-black"
                textHoverColor="hover:text-black"
                shadowHover="hover:shadow-none"
                className="w-full hover:underline hover:underline-offset-4 disabled:bg-transparent mt-2"
            >
                Retour
            </Button>
        </div>
    );
}