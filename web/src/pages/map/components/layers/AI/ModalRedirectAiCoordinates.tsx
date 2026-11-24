import { useMap } from "react-leaflet";
import { Navigation } from "lucide-react";
import Modal from "../../../../../ui/Modal";
import ModalButton from "../../../../../ui/ModalButton";

type ModalRedirectAiCoordinatesProps = {
  coordinates: string;
  onClose: () => void;
};

type AiCoordinates = { lat: number; lon: number; name?: string };

export default function ModalRedirectAiCoordinates({ coordinates, onClose }: ModalRedirectAiCoordinatesProps) {
  const map = useMap();
  const target: AiCoordinates = JSON.parse(coordinates);

  const handleRedirect = () => {
    map.flyTo([target.lat, target.lon], 12, { duration: 2 });
    onClose();
  };

  return (
    <Modal
      title="Aller à cet endroit ?"
      subtitle="Proposition de l’assistant Primo"
      icon={Navigation}
      size="sm"
      onClose={onClose}
      footer={
        <>
          <ModalButton variant="secondary" onClick={onClose}>Rester ici</ModalButton>
          <ModalButton icon={Navigation} onClick={handleRedirect}>Y aller</ModalButton>
        </>
      }
    >
      <p className="text-sm text-[#52525b] dark:text-[#d4d4d8]">
        La carte va se déplacer vers <span className="font-semibold text-[#1c1c1e] dark:text-white">{target.name || "ces coordonnées"}</span>.
      </p>
    </Modal>
  );
}
