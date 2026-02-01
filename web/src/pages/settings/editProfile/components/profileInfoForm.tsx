import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "../../../../requests/UserRequests";

// UI COMPONENTS
import Input from "../../../../ui/Input";
import AvatarUpload from "./AvatarUpload.tsx";

// ASSETS
import { toast } from "react-hot-toast";

export default function ProfileInfoForm() {
  const token = localStorage.getItem("token") || "";

  const [formData, setFormData] = useState(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      return {
        firstName: user.firstName || "",
        lastName: user.surName || "",
        email: user.email || "",
        profilePicture: user.profilePicture || "green.png"
      };
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      profilePicture: "green.png"
    };
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => updateUserProfile(token, data),
    onSuccess: (response) => {
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      toast.success("Profil mis à jour avec succès !");
    },
    onError: (error) => {
      console.error("Erreur mise à jour:", error);
      toast.error("Erreur lors de la mise à jour du profil.");
    }
  });

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleImageUpdate = (imageName: string) => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: imageName
    }));
  };

  const saveProfile = () => {
    const payload = {
      firstName: formData.firstName,
      surName: formData.lastName,
      profilePicture: formData.profilePicture
    };

    mutate(payload);
  };

  return (
    <div className="flex w-full flex-col">
      {/* HEADER */}
      <div className="flex w-full items-end justify-between pb-1">
        <h1 className="font-UberMove mb-1 text-2xl font-medium text-gray-900 leading-none">
          Mes informations
        </h1>
        <button
          disabled={isPending}
          onClick={saveProfile}
          className={`mb-1 text-sm text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm
            ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#388160] hover:bg-[#2d664c] active:scale-95'}
          `}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enregistrement...
            </div>
          ) : "Enregistrer"}
        </button>
      </div>

      <hr className="border-t border-gray-200" />

      {/* FORMULAIRE */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mt-10">
        <div className="flex flex-col w-full md:w-2/3 space-y-7">
          {/* Prénom */}
          <div className="flex flex-col space-y-1.5 w-1/2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Prénom</label>
            <Input
              type="text"
              height="h-10"
              placeholder="Prénom"
              onChange={(val: string) => handleFieldChange("firstName", val)}
              value={formData.firstName}
              className="bg-[#EFEFF4] border-none focus:ring-2 focus:ring-[#388160]"
            />
          </div>

          {/* Nom */}
          <div className="flex flex-col space-y-1.5 w-[80%]">
            <label className="text-sm font-semibold text-gray-700 ml-1">Nom de famille</label>
            <Input
              type="text"
              height="h-10"
              placeholder="Nom"
              onChange={(val: string) => handleFieldChange("lastName", val)}
              value={formData.lastName}
              className="bg-[#EFEFF4] border-none focus:ring-2 focus:ring-[#388160]"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col space-y-1.5 w-full">
            <label className="text-sm font-semibold text-gray-400 ml-1 italic">Adresse e-mail (non modifiable)</label>
            <div className="relative">
              <Input
                type="email"
                height="h-10"
                value={formData.email}
                onChange={() => { }}
                className="bg-[#EFEFF4] border-none text-gray-400 cursor-not-allowed opacity-70"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* AVATAR */}
        <div className="flex w-full md:w-1/3 justify-center pt-4 ">
          <AvatarUpload
            currentImage={formData.profilePicture}
            onImageChange={handleImageUpdate}
          />
        </div>
      </div>
    </div>
  );
}