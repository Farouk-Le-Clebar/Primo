import React, { useState } from "react";

// ASSETS
import greenUrl from "../../assets/profilePictures/green.svg";
import cyanUrl from "../../assets/profilePictures/cyan.svg";
import blueUrl from "../../assets/profilePictures/blue.svg";
import orangeUrl from "../../assets/profilePictures/orange.svg";
import pinkUrl from "../../assets/profilePictures/pink.svg";
import redUrl from "../../assets/profilePictures/red.svg";
import whiteUrl from "../../assets/profilePictures/white.svg";
import whitePinkUrl from "../../assets/profilePictures/whitepink.svg";
import yellowUrl from "../../assets/profilePictures/yellow.svg";

type AvatarImageComponent = React.FC<{ className?: string }>;

const createAvatarImage = (src: string): AvatarImageComponent => {
  const AvatarImage = ({ className }: { className?: string }) => (
    <img src={src} alt="" decoding="async" className={className} />
  );
  return AvatarImage;
};

const PPGreen = createAvatarImage(greenUrl);

export const AVATAR_COMPONENTS: Record<string, AvatarImageComponent> = {
  "green.png": PPGreen,
  "cyan.png": createAvatarImage(cyanUrl),
  "blue.png": createAvatarImage(blueUrl),
  "orange.png": createAvatarImage(orangeUrl),
  "pink.png": createAvatarImage(pinkUrl),
  "red.png": createAvatarImage(redUrl),
  "white.png": createAvatarImage(whiteUrl),
  "whitepink.png": createAvatarImage(whitePinkUrl),
  "yellow.png": createAvatarImage(yellowUrl),
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
): AvatarImageComponent {
  return AVATAR_COMPONENTS[profilePicture ?? DEFAULT_AVATAR] ?? PPGreen;
}

interface AvatarProps {
  profilePicture: string | null | undefined;
  /* (défaut: "w-10 h-10") */
  size?: string;
  className?: string;
}

export default function Avatar({
  profilePicture,
  size = "w-10 h-10",
  className = "",
}: AvatarProps) {
  const AvatarComponent = getAvatarComponent(profilePicture);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const externalUrl =
    profilePicture && /^https?:\/\//i.test(profilePicture)
      ? profilePicture
      : null;

  return (
    <div
      className={`${size} rounded-full overflow-hidden border border-white shadow-sm flex-shrink-0 ${className}`}
    >
      {externalUrl && failedUrl !== externalUrl ? (
        <img
          key={externalUrl}
          src={externalUrl}
          alt=""
          referrerPolicy="no-referrer"
          loading="lazy"
          className="block w-full h-full object-cover"
          onError={() => setFailedUrl(externalUrl)}
        />
      ) : (
        <AvatarComponent className="w-full h-full" />
      )}
    </div>
  );
}
