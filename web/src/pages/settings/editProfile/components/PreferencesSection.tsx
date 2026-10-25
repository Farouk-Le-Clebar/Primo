import { useTheme } from "../../../../context/ThemeProvider";
import type { Theme } from "../../../../context/ThemeProvider";
import type { MapPreference } from "../../../../hooks/useAccountSettings";
import ProfileSection from "./ProfileSection";
import ProfileRow from "./ProfileRow";
import SegmentedControl from "../../../../ui/SegmentedControl";

type PreferencesSectionProps = {
  mapPreference: MapPreference;
  onMapChange: (preference: MapPreference) => void;
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

export default function PreferencesSection({ mapPreference, onMapChange }: PreferencesSectionProps) {
  const { theme, setTheme } = useTheme();

  return (
    <ProfileSection title="Préférences" description="Enregistrées automatiquement.">
      <ProfileRow label="Apparence" hint="Auto suit le réglage de votre appareil.">
        <SegmentedControl id="profile-theme" label="Apparence" value={theme} options={THEME_OPTIONS} onChange={setTheme} />
      </ProfileRow>
      <ProfileRow label="Fond de carte par défaut" hint="Utilisé à chaque ouverture de la carte.">
        <SegmentedControl id="profile-map" label="Fond de carte" value={mapPreference} options={MAP_OPTIONS} onChange={onMapChange} />
      </ProfileRow>
    </ProfileSection>
  );
}
