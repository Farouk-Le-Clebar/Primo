import { useState } from "react";
import { X } from "lucide-react";

// ASSETS
import PPGreen from "../../../../assets/profilePictures/green.svg?react";
import PPCyan from "../../../../assets/profilePictures/cyan.svg?react";
import PPBlue from "../../../../assets/profilePictures/blue.svg?react";
import PPOrange from "../../../../assets/profilePictures/orange.svg?react";
import PPpink from "../../../../assets/profilePictures/pink.svg?react";
import PPRed from "../../../../assets/profilePictures/red.svg?react";
import PPWhite from "../../../../assets/profilePictures/white.svg?react";
import PPWhitePink from "../../../../assets/profilePictures/whitepink.svg?react";
import PPYellow from "../../../../assets/profilePictures/yellow.svg?react";

// Dictionnaire des avatars
const AVATAR_COMPONENTS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  "green.png": PPGreen,
  "cyan.png": PPCyan,
  "blue.png": PPBlue,
  "orange.png": PPOrange,
  "pink.png": PPpink,
  "red.png": PPRed,
  "white.png": PPWhite,
  "whitepink.png": PPWhitePink,
  "yellow.png": PPYellow,
};

const PRESET_AVATARS = [
  "blue.png", "cyan.png", "green.png", "orange.png",
  "pink.png", "white.png", "whitepink.png", "yellow.png"
];

interface AvatarUploadProps {
  currentImage: string; 
  onImageChange: (imageName: string) => void; 
}

export default function AvatarUpload({ currentImage, onImageChange }: AvatarUploadProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentImage || "green.png");

  const selectPreset = (avatarName: string) => {
    setSelectedAvatar(avatarName);
    onImageChange(avatarName);
    setIsModalOpen(false);
  };

  const CurrentAvatarComponent = AVATAR_COMPONENTS[selectedAvatar] || PPGreen;

  return (
    <>
      <div 
        className="relative group cursor-pointer" 
        onClick={() => setIsModalOpen(true)}
      >
        <div className="w-46 h-46 rounded-full overflow-hidden border-4 border-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:brightness-95">
          <CurrentAvatarComponent className="w-full h-full" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-[10px] font-bold uppercase tracking-widest text-center px-2">
              Changer l'avatar
            </span>
          </div>
        </div>

        <div className="absolute bottom-2 right-2 bg-white text-gray-700 p-2.5 rounded-full shadow-lg border border-gray-100 group-hover:scale-110 transition-transform">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div 
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col">
                    <h3 className="text-2xl font-UberMove text-gray-800">Choisir un avatar</h3>
                    <p className="text-gray-500 font-UberMoveMedium text-sm mt-1">
                        Sélectionnez l'image qui vous ressemble le plus.
                    </p>
                </div>
                
                <button 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                    <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {PRESET_AVATARS.map((avatar) => {
                  const AvatarComponent = AVATAR_COMPONENTS[avatar] || PPGreen;
                  return (
                    <button
                      key={avatar}
                      onClick={() => selectPreset(avatar)}
                      className="relative aspect-square rounded-full overflow-hidden border-2 border-transparent hover:border-[#388160] hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#388160] focus:ring-offset-2"
                    >
                      <AvatarComponent className="w-full h-full" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setIsModalOpen(false)}></div>
        </div>
      )}
    </>
  );
}