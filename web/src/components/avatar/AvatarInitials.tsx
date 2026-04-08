import React from "react";

const AVATAR_COLORS = [
    "#F59E0B",
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#EF4444",
    "#EC4899",
    "#F97316",
    "#06B6D4",
];

export function avatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function avatarInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}


// Composant Avatar pour afficher les initiales d'un utilisateur
// Example d'utilisation : <AvatarI name={item.actorName} size={36} /> 
const AvatarI = memo(({ name, size = 36 }: { name: string; size?: number }) => {
    const color = avatarColor(name);
    const initials = avatarInitials(name);
    return (
        <span
            className="rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold select-none"
            style={{
                width: size,
                height: size,
                background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color})`,
                fontSize: size * 0.36,
                boxShadow: `0 0 0 2px ${color}22`,
            }}
            aria-label={name}
        >
            {initials}
        </span>
    );
});

function memo<T extends object>(
    component: React.FC<T>,
    areEqual?: (prevProps: Readonly<T>, nextProps: Readonly<T>) => boolean,
) {
    return React.memo(component, areEqual);
}

AvatarI.displayName = "AvatarI";

export { AvatarI };
