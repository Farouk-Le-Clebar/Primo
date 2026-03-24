import React from "react";

// ASSETS
import PPGreen from "../../assets/profilePictures/green.svg?react";
import PPCyan from "../../assets/profilePictures/cyan.svg?react";
import PPBlue from "../../assets/profilePictures/blue.svg?react";
import PPOrange from "../../assets/profilePictures/orange.svg?react";
import PPPink from "../../assets/profilePictures/pink.svg?react";
import PPRed from "../../assets/profilePictures/red.svg?react";
import PPWhite from "../../assets/profilePictures/white.svg?react";
import PPWhitePink from "../../assets/profilePictures/whitepink.svg?react";
import PPYellow from "../../assets/profilePictures/yellow.svg?react";

export const AVATAR_COMPONENTS: Record<
    string,
    React.FC<React.SVGProps<SVGSVGElement>>
> = {
    "green.png": PPGreen,
    "cyan.png": PPCyan,
    "blue.png": PPBlue,
    "orange.png": PPOrange,
    "pink.png": PPPink,
    "red.png": PPRed,
    "white.png": PPWhite,
    "whitepink.png": PPWhitePink,
    "yellow.png": PPYellow,
};

export const DEFAULT_AVATAR = "green.png";

export const PRESET_AVATARS = [
    "blue.png",
    "cyan.png",
    "green.png",
    "orange.png",
    "pink.png",
    "white.png",
    "whitepink.png",
    "yellow.png",
];

export function getAvatarComponent(
    profilePicture: string | null | undefined,
): React.FC<React.SVGProps<SVGSVGElement>> {
    return AVATAR_COMPONENTS[profilePicture ?? DEFAULT_AVATAR] ?? PPGreen;
}

interface AvatarProps {
    profilePicture: string | null | undefined;
    /* (défaut: "w-10 h-10") */
    size?: string;
    className?: string;
}

/**
 * Composant Avatar réutilisable.
 * Example : <Avatar profilePicture={member.profilePicture} size="w-8 h-8" />
 */
export default function Avatar({
    profilePicture,
    size = "w-10 h-10",
    className = "",
}: AvatarProps) {
    const AvatarComponent = getAvatarComponent(profilePicture);

    return (
        <div
            className={`${size} rounded-full overflow-hidden border border-white shadow-sm flex-shrink-0 ${className}`}
        >
            <AvatarComponent className="w-full h-full" />
        </div>
    );
}

