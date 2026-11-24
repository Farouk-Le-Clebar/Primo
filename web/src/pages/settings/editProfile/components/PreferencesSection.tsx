import { useTheme } from "../../../../context/ThemeProvider";
import type { Theme } from "../../../../context/ThemeProvider";
import type { MapPreference } from "../../../../hooks/useAccountSettings";
import { useMapColors } from "../../../../hooks/useMapColors";
import { useResolvedTheme } from "../../../../hooks/useResolvedTheme";
import { getPaletteColors } from "../../../../utils/mapColors";
import ProfileSection from "./ProfileSection";
import ProfileRow from "./ProfileRow";
import ProfileNavRow from "./ProfileNavRow";
import ColorSwatchGroup from "./mapColors/ColorSwatchGroup";
import SegmentedControl from "../../../../ui/SegmentedControl";

type PreferencesSectionProps = {
  mapPreference: MapPreference;
  onMapChange: (preference: MapPreference) => void;
  onOpenMapColors: () => void;
  shouldFocusMapColors: boolean;
};

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "system", label: "Auto" },
];

const MAP_OPTIONS: { value: MapPreference; label: string }[] = [
  { value: "basic", label: "Plan" },
  { value: "satellite", label: "Satellite" },
];

export default function PreferencesSection({ mapPreference, onMapChange, onOpenMapColors, shouldFocusMapColors }: PreferencesSectionProps) {
  const { theme, setTheme } = useTheme();
  const { colors } = useMapColors();
  const mode = useResolvedTheme();

  return (
    <ProfileSection title="Préférences" description="Enregistrées automatiquement.">
      <ProfileRow label="Apparence" hint="Auto suit le réglage de votre appareil.">
        <SegmentedControl id="profile-theme" label="Apparence" value={theme} options={THEME_OPTIONS} onChange={setTheme} />
      </ProfileRow>
      <ProfileRow label="Fond de carte par défaut" hint="Utilisé à chaque ouverture de la carte.">
        <SegmentedControl id="profile-map" label="Fond de carte" value={mapPreference} options={MAP_OPTIONS} onChange={onMapChange} />
      </ProfileRow>
      <ProfileNavRow
        label="Couleurs de la carte"
        hint="Utilisées pour les bordures et l'intérieur des parcelles"
        autoFocus={shouldFocusMapColors}
        onClick={onOpenMapColors}
      >
        <ColorSwatchGroup colors={getPaletteColors(colors[mode])} />
      </ProfileNavRow>
    </ProfileSection>
  );
}
