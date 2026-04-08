import { Check } from "lucide-react";

type PlanCardProps = {
    id: string;
    price: string;
    title: string;
    titleColor: string;
    description: string;
    features: string[];
    isPopular?: boolean;
    isSelected: boolean;
    onSelect: (id: string) => void;
};

export default function PlanCard({ 
    id, price, title, titleColor, description, features, isPopular, isSelected, onSelect 
}: PlanCardProps) {
    return (
        <div 
            onClick={() => onSelect(id)}
            className={`relative flex flex-col p-8 bg-white rounded-2xl cursor-pointer transition-all ${
                isSelected 
                    ? "border-2 border-black ring-4 ring-gray-100" 
                    : "border-2 border-gray-200 hover:border-gray-300"
            }`}
        >
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00A63E] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wide">
                    POPULAIRE
                </div>
            )}
            
            {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
            )}

            <div className="flex items-end gap-1 mb-2 mt-2">
                <span className="text-4xl font-semibold text-black">{price}</span>
                <span className="text-[13px] text-[#949496] font-inter mb-1">/mois</span>
            </div>

            <h3 className={`text-base font-semibold mb-3 ${titleColor}`}>{title}</h3>
            
            <p className="text-[13px] text-[#949496] font-inter mb-6 leading-relaxed min-h-[40px]">
                {description}
            </p>

            <ul className="space-y-3 flex-1">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center text-[13px] text-[#4B4B4B] font-inter">
                        <Check className={`w-[18px] h-[18px] mr-2 ${titleColor}`} strokeWidth={2.5} />
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    );
}