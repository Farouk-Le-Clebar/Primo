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
            <h1 className="font-inter font-medium text-[42px] text-black dark:text-white mb-4 transition-colors">
                Préférences
            </h1>
          
            <p className="font-inter font-base text-lg text-[#949496] dark:text-gray-400 mb-10 transition-colors">
                Configurez vos notifications et alertes.
            </p>

            <div className="w-full space-y-4 mb-10 text-left">
                <div className="flex items-center justify-between border border-gray-100 dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#171717] rounded-xl p-5 transition-colors">
                    <div>
                        <p className="font-inter font-medium text-[15px] text-black dark:text-white mb-1 transition-colors">Notifications</p>
                        <p className="font-inter text-[13px] text-[#949496] dark:text-gray-400 transition-colors">Recevoir des alertes sur vos parcelles</p>
                    </div>
                    <button
                        onClick={() => {}}
                        className="relative inline-flex h-7 w-[44px] items-center rounded-full bg-black dark:bg-white transition-colors focus:outline-none"
                    >
                        <span className="inline-block h-[22px] w-[22px] translate-x-[18px] transform rounded-full bg-white dark:bg-black transition-transform" />
                    </button>
                </div>

                <div className="flex items-center justify-between border border-gray-100 dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#171717] rounded-xl p-5 transition-colors">
                    <div>
                        <p className="font-inter font-medium text-[15px] text-black dark:text-white mb-1 transition-colors">Rapports hebdomadaires</p>
                        <p className="font-inter text-[13px] text-[#949496] dark:text-gray-400 transition-colors">Recevoir les e-mails des nouveautés Primo</p>
                    </div>
                    <button
                        onClick={() => setNewsletter(!newsletter)}
                        className={`relative inline-flex h-7 w-[44px] items-center rounded-full transition-colors focus:outline-none ${
                            newsletter ? "bg-black dark:bg-white" : "bg-[#E5E5EA] dark:bg-[#333333]"
                        }`}
                    >
                        <span className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white dark:bg-[#171717] transition-transform ${
                            newsletter ? "translate-x-[18px] dark:bg-black" : "translate-x-[2px] bg-white dark:bg-gray-400"
                        }`} />
                    </button>
                </div>

                <div className="flex items-center justify-between border border-gray-100 dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#171717] rounded-xl p-5 transition-colors">
                    <div>
                        <p className="font-inter font-medium text-[15px] text-black dark:text-white mb-1 transition-colors">Activité</p>
                        <p className="font-inter text-[13px] text-[#949496] dark:text-gray-400 transition-colors">Afficher mon activité aux autres</p>
                    </div>
                    <button
                        onClick={() => setPublicActivity(!publicActivity)}
                        className={`relative inline-flex h-7 w-[44px] items-center rounded-full transition-colors focus:outline-none ${
                            publicActivity ? "bg-black dark:bg-white" : "bg-[#E5E5EA] dark:bg-[#333333]"
                        }`}
                    >
                        <span className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white dark:bg-[#171717] transition-transform ${
                            publicActivity ? "translate-x-[18px] dark:bg-black" : "translate-x-[2px] bg-white dark:bg-gray-400"
                        }`} />
                    </button>
                </div>
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