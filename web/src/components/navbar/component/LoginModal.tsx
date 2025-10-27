import LogoFacebook from "../../../assets/logos/LogoFacebook.svg";
import LogoGoogle from "../../../assets/logos/LogoGoogle.svg";
import LogoApple from "../../../assets/logos/LogoApple.svg";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-10 w-[600px] h-[670px] text-left animate-fade-in">
        <h2 className="text-3xl font-UberMoveBold text-gray-800 mb-1">
          Connectez-vous
        </h2>

        <p className="text-gray-600 font-UberMoveMedium mb-4">
          Pas encore de compte ? Vous pouvez vous connecter directement avec Facebook, Apple ou Google, ou bien simplement saisir votre adresse e-mail pour commencer la création de votre compte.
        </p>
        <div className="space-y-4">
            <button onClick={onClose} className="flex items-center justify-start bg-blue-600 text-white pl-4 px-9 py-3 rounded-lg hover:bg-blue-700 transition w-full">
                <img src={LogoFacebook} alt="icone" className="h-7 w-7 mr-2" />
                <span className="font-UberMoveMedium text-lg">Se connecter avec Facebook</span>
            </button>

            <button onClick={onClose} className="flex items-center justify-start bg-gray-100 text-gray-800 pl-4 pr-9 py-3 rounded-lg shadow-lg shadow-gray-300 hover:shadow-xl hover:bg-gray-200 transition w-full">
                <img src={LogoGoogle} alt="icone" className="h-7 w-7 mr-2" />
                <span className="font-UberMoveMedium text-lg">Se connecter avec Google</span>
            </button>

            <button onClick={onClose} className="flex items-center justify-start bg-black text-white pl-4 px-9 py-3 rounded-lg hover:bg-gray-800 transition w-full">
                <img src={LogoApple} alt="icone" className="h-7 w-7 mr-2" />
                <span className="font-UberMoveMedium text-lg">Se connecter avec Apple</span>
            </button>
        </div>
      </div>
    </div>
  );
}
