import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import SegmentedControl from "../../../../../ui/SegmentedControl";
import { MAP_BACKGROUNDS } from "../../../../../constants/mapColorPresets";
import type { MapColorsDraft } from "../../../../../hooks/useMapColorsDraft";
import type { ColorMode } from "../../../../../types/mapColors";
import { getReadabilityIssues } from "../../../../../utils/contrast";
import { COLOR_MODE_LABELS } from "../../../../../utils/mapColors";
import ProfileSection from "../ProfileSection";
import ColorStateEditor from "./ColorStateEditor";
import MapColorsActions from "./MapColorsActions";
import MapPreview from "./MapPreview";
import PresetList from "./PresetList";
import ReadabilityHints from "./ReadabilityHints";

type MapColorsPanelProps = {
  editor: MapColorsDraft;
  isLeaveWarningVisible: boolean;
  onBack: () => void;
  onConfirmLeave: () => void;
  onCancelLeave: () => void;
};

const MODES: ColorMode[] = ["light", "dark"];
const MODE_OPTIONS = MODES.map((mode) => ({ value: mode, label: COLOR_MODE_LABELS[mode] }));
const TITLE_ID = "map-colors-title";

export default function MapColorsPanel({ editor, isLeaveWarningVisible, onBack, onConfirmLeave, onCancelLeave }: MapColorsPanelProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const palette = editor.draft[editor.mode];
  const issues = useMemo(() => getReadabilityIssues(palette, MAP_BACKGROUNDS[editor.mode]), [palette, editor.mode]);

  useEffect(() => titleRef.current?.focus(), []);

  return (
    <section aria-labelledby={TITLE_ID} className="@container flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label="Retour au profil"
            onClick={onBack}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-black/[0.05] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:text-gray-300 dark:hover:bg-white/[0.08]"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <h2 id={TITLE_ID} ref={titleRef} tabIndex={-1} className="truncate text-base font-semibold text-gray-900 outline-none dark:text-white">
            Couleurs de la carte
          </h2>
        </div>
        <SegmentedControl id="map-colors-mode" label="Thème modifié" value={editor.mode} options={MODE_OPTIONS} onChange={editor.setMode} />
      </header>

      {editor.isError && (
        <p role="status" className="text-xs text-amber-700 dark:text-amber-400">Vos couleurs n'ont pas pu être chargées. Couleurs par défaut affichées.</p>
      )}

      {editor.isLoading ? (
        <div role="status" aria-label="Chargement des couleurs" className="h-64 animate-pulse rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] motion-reduce:animate-none" />
      ) : (
        <>
          <ProfileSection title="Aperçu" description="Survolez une parcelle ou affichez le survol.">
            <MapPreview palette={palette} mode={editor.mode} />
          </ProfileSection>
          <ProfileSection title="Préréglages" description="Des assemblages prêts à l'emploi.">
            <PresetList mode={editor.mode} palette={palette} presetId={editor.presetId} onSelect={editor.applyPreset} />
          </ProfileSection>
          <ProfileSection title="Couleurs" description={`Thème ${COLOR_MODE_LABELS[editor.mode].toLowerCase()}, pour chaque état de parcelle.`}>
            <ColorStateEditor palette={palette} onChange={editor.updateState} />
            <ReadabilityHints issues={issues} />
          </ProfileSection>
          <MapColorsActions
            isDirty={editor.isDirty}
            isDefault={editor.isDefault}
            isSaving={editor.isSaving}
            isResetting={editor.isResetting}
            isLeaveWarningVisible={isLeaveWarningVisible}
            onSave={editor.save}
            onDiscard={editor.discard}
            onReset={editor.reset}
            onConfirmLeave={onConfirmLeave}
            onCancelLeave={onCancelLeave}
          />
        </>
      )}
    </section>
  );
}
