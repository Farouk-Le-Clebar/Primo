import { useState } from "react";
import Button from "../../ui/Button";
import PlanCard from "./PlanCard";

type Props = {
    onSelectPlan: (plan: string) => void;
    onBack: () => void;
};

export default function Step4Plan({ onSelectPlan, onBack }: Props) {
    const [selectedPlan, setSelectedPlan] = useState<string>("basic");

    return (
        <div className="flex flex-col items-center w-full max-w-5xl animate-fade-in relative pb-12">
            <h1 className="font-inter font-medium text-[42px] text-black mb-4">
                Choisissez votre plan
            </h1>
          
            <p className="font-inter font-base text-lg text-[#949496] mb-12">
                Modifiez ou annulez à tout moment.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
                <PlanCard
                    id="beta"
                    price="0€"
                    title="Version Béta"
                    titleColor="text-[#3B82F6]"
                    description="Découvrez Primo avec toutes les fonctionnalités de base."
                    features={[
                        "Analyse de 5 parcelles/mois",
                        "Données cadastrales basiques",
                        "Export PDF",
                        "Support communautaire"
                    ]}
                    isSelected={selectedPlan === "beta"}
                    onSelect={setSelectedPlan}
                />

                <PlanCard
                    id="basic"
                    price="0€"
                    title="Version Basique"
                    titleColor="text-[#00A63E]"
                    description="Pour les professionnels qui analysent régulièrement."
                    features={[
                        "Parcelles illimitées",
                        "Données enrichies PLU/PPRI",
                        "Export Excel & PDF",
                        "Support prioritaire"
                    ]}
                    isPopular={true}
                    isSelected={selectedPlan === "basic"}
                    onSelect={setSelectedPlan}
                />

                <PlanCard
                    id="pro"
                    price="13€"
                    title="Version Pro"
                    titleColor="text-[#F97316]"
                    description="Accès complet pour les experts du foncier."
                    features={[
                        "Tout le Basique +",
                        "API dédiée & webhooks",
                        "Rapports automatisés",
                        "Compte manager dédié"
                    ]}
                    isSelected={selectedPlan === "pro"}
                    onSelect={setSelectedPlan}
                />
            </div>

            <div className="flex flex-col items-center w-full max-w-lg">
                <Button
                    onClick={() => onSelectPlan(selectedPlan)}
                    backgroundColor="bg-black"
                    backgroundHoverColor="hover:bg-gray-800"
                    textColor="text-white"
                    textSize="font-inter font-medium text-base"
                    className="w-full rounded-lg py-3 mb-2"
                >
                    Choisir ce plan
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
                    className="w-full hover:underline hover:underline-offset-4 disabled:bg-transparent"
                >
                    Retour
                </Button>
            </div>
        </div>
    );
}