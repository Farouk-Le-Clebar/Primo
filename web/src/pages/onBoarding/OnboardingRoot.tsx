import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Step1Welcome from "./Step1Welcome";
import Step2Theme from "./Step2Theme";
import Step3Settings from "./Step3Settings";
import Step4Plan from "./Step4Plan";

export default function OnboardingRoot() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    const [theme, setTheme] = useState("light");
    const [publicActivity, setPublicActivity] = useState(true);
    const [newsletter, setNewsletter] = useState(true);

    const handleNext = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const finishOnboarding = (selectedPlan: string) => {
        const userData = {
            theme,
            publicActivity,
            newsletter,
            plan: selectedPlan,
        };
        console.log("Onboarding terminé :", userData);
        navigate("/dashboard", { state: { welcome: true } });
    };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative font-inter">
        <div className="w-full max-w-4xl px-4 flex flex-col items-center animate-fade-in-up">
            {currentStep === 1 && <Step1Welcome onNext={handleNext} />}
            {currentStep === 2 && <Step2Theme theme={theme} setTheme={setTheme} onNext={handleNext} onBack={handleBack} />}
            {currentStep === 3 && <Step3Settings publicActivity={publicActivity} setPublicActivity={setPublicActivity} newsletter={newsletter} setNewsletter={setNewsletter} onNext={handleNext} onBack={handleBack} />}
            {currentStep === 4 && <Step4Plan onSelectPlan={finishOnboarding} onBack={handleBack}/>}
        </div>

      <div className="absolute bottom-16 flex space-x-2">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              step <= currentStep ? "bg-black" : "bg-transparent border border-black"
            }`}
          />
        ))}
      </div>
    </div>
  );
}