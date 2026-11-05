import { useId, useState } from "react";
import type { ChangeEvent } from "react";

type HexInputProps = {
  label: string;
  value: string;
  onChange: (color: string) => void;
  onCommit: (color: string) => void;
};

const HEX_COLOR = /^#[0-9a-f]{6}$/;

const normalizeHex = (text: string): string => {
  const trimmed = text.trim().toLowerCase();
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
};

export default function HexInput({ label, value, onChange, onCommit }: HexInputProps) {
  const errorId = useId();
  const [editedText, setEditedText] = useState<string | null>(null);
  const text = editedText ?? value;
  const isInvalid = !HEX_COLOR.test(normalizeHex(text));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedText(event.target.value);
    const color = normalizeHex(event.target.value);
    if (HEX_COLOR.test(color)) {
      onChange(color);
      onCommit(color);
    }
  };

  return (
    <div className="min-w-0 flex-1">
      <input
        type="text"
        value={text}
        spellCheck={false}
        autoComplete="off"
        maxLength={7}
        aria-label={`Code hexadécimal, ${label}`}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? errorId : undefined}
        onChange={handleChange}
        onFocus={() => setEditedText(value)}
        onBlur={() => setEditedText(null)}
        className={`h-9 w-full rounded-lg border bg-black/[0.03] px-3 font-mono text-sm text-gray-900 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:bg-white/[0.06] dark:text-white ${isInvalid ? "border-amber-500" : "border-black/[0.06] dark:border-white/10"}`}
      />
      {isInvalid && <p id={errorId} className="mt-1 text-xs text-amber-700 dark:text-amber-400">Format attendu : #rrggbb</p>}
    </div>
  );
}
