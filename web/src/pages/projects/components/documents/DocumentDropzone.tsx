import { useState } from "react";
import { Upload } from "lucide-react";

type DocumentDropzoneProps = { progress: number | null; onFiles: (files: File[]) => void };

export const ACCEPTED_TYPES = ".pdf,.docx,.png,.jpg,.jpeg";

export default function DocumentDropzone({ progress, onFiles }: DocumentDropzoneProps) {
  const [isOver, setIsOver] = useState(false);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsOver(false);
    onFiles([...event.dataTransfer.files]);
  };

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      className={`group relative mt-1 flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed py-3.5 text-xs font-medium transition-all ${isOver ? "scale-[1.01] border-blue-500 bg-blue-500/5 text-blue-500" : "border-[#1c1c1e]/18 text-[#82828c] hover:border-[#1c1c1e]/35 dark:border-white/18 dark:hover:border-white/35"}`}
    >
      {progress != null && <span className="absolute inset-y-0 left-0 bg-blue-500/10 transition-[width] duration-300" style={{ width: `${progress}%` }} />}
      <Upload className={`h-3.5 w-3.5 transition-transform ${isOver ? "-translate-y-0.5" : "group-hover:-translate-y-0.5"}`} />
      {progress != null ? `Envoi en cours · ${progress} %` : "Glissez vos fichiers ici · PDF, images, Word · 20 Mo max"}
      <input type="file" accept={ACCEPTED_TYPES} multiple className="hidden" onChange={(event) => onFiles([...(event.target.files ?? [])])} />
    </label>
  );
}
