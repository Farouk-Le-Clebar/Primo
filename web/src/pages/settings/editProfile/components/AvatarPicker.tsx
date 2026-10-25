import { motion } from "framer-motion";
import { PRESET_AVATARS, getAvatarComponent } from "../../../../components/avatar/Avatar";

type AvatarPickerProps = {
  value: string;
  onChange: (avatar: string) => void;
};

export default function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div role="radiogroup" aria-label="Avatar" className="grid grid-cols-8 gap-2 px-5 py-4">
      {PRESET_AVATARS.map((avatar) => {
        const AvatarComponent = getAvatarComponent(avatar);
        const isActive = avatar === value;
        return (
          <button
            key={avatar}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`Avatar ${avatar.replace(".png", "")}`}
            onClick={() => onChange(avatar)}
            className="relative aspect-square rounded-full p-0.5 transition-transform duration-150 hover:scale-105 cursor-pointer"
          >
            {isActive && (
              <motion.span layoutId="profile-avatar" transition={{ duration: 0.2, ease: "easeOut" }} className="absolute inset-0 rounded-full ring-2 ring-gray-900 dark:ring-white" />
            )}
            <span className="block h-full w-full overflow-hidden rounded-full">
              <AvatarComponent className="h-full w-full" />
            </span>
          </button>
        );
      })}
    </div>
  );
}
