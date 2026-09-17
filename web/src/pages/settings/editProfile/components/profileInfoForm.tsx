import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "../../../../requests/UserRequests";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Divider, TextInput, Button } from '@tremor/react';
import AvatarUpload from "./AvatarUpload.tsx";

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
                profilePicture: user.profilePicture || "green.png",
            };
        }
        return {
            firstName: "",
            lastName: "",
            email: "",
            profilePicture: "green.png",
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
        },
    });

    const handleFieldChange = (fieldName: string, value: string) => {
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
    };

    const handleImageUpdate = (imageName: string) => {
        setFormData((prev) => ({
            ...prev,
            profilePicture: imageName,
        }));
    };

    const saveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            firstName: formData.firstName,
            surName: formData.lastName,
            profilePicture: formData.profilePicture,
        };

        mutate(payload);
    };

    return (
        <div className="w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                Informations du compte
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                Mettez à jour vos informations personnelles et votre photo de profil.
            </p>

            <div className="mt-8">
                <form onSubmit={saveProfile}>
                    <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-12">
                        <div className="flex flex-col w-full md:w-2/3 space-y-6">
                            
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200"
                                >
                                    Prénom
                                </label>
                                <TextInput
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Prénom"
                                    value={formData.firstName}
                                    onChange={(e) => handleFieldChange("firstName", e.target.value)}
                                    className="mt-2 w-full rounded-md dark:bg-[#0A0A0A] dark:border-white/10 dark:text-white sm:max-w-lg"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="lastName"
                                    className="text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200"
                                >
                                    Nom de famille
                                </label>
                                <TextInput
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Nom"
                                    value={formData.lastName}
                                    onChange={(e) => handleFieldChange("lastName", e.target.value)}
                                    className="mt-2 w-full rounded-md dark:bg-[#0A0A0A] dark:border-white/10 dark:text-white sm:max-w-lg"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-500 dark:text-gray-400 italic transition-colors duration-200"
                                >
                                    Adresse e-mail (non modifiable)
                                </label>
                                <TextInput
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="mt-2 w-full rounded-md bg-gray-50 dark:bg-white/5 dark:border-white/10 text-gray-400 cursor-not-allowed sm:max-w-lg"
                                />
                            </div>
                            
                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full sm:w-auto bg-black hover:bg-black/85 text-white dark:bg-white dark:text-black dark:hover:bg-white/85 border-none transition-colors"
                                >
                                    {isPending ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Enregistrement...
                                        </span>
                                    ) : (
                                        "Enregistrer les modifications"
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="flex w-full md:w-1/3 justify-center md:justify-end">
                            <AvatarUpload
                                currentImage={formData.profilePicture}
                                onImageChange={handleImageUpdate}
                            />
                        </div>
                    </div>
                </form>
            </div>
            
            <Divider className="my-10 dark:bg-white/10" />
        </div>
    );
}