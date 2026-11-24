const CHIME_NOTES: { frequency: number; start: number }[] = [
  { frequency: 880, start: 0 },
  { frequency: 1318.5, start: 0.11 },
];
const NOTE_DURATION_S = 0.32;
const PEAK_GAIN = 0.12;

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  audioContext ??= new AudioContext();
  return audioContext;
};

export function unlockNotificationSound(): void {
  const unlock = () => void getAudioContext()?.resume();
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

export function playNotificationSound(): void {
  const context = getAudioContext();
  if (!context || context.state !== "running") return;
  const now = context.currentTime;

  CHIME_NOTES.forEach(({ frequency, start }) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(PEAK_GAIN, now + start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + NOTE_DURATION_S);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now + start);
    oscillator.stop(now + start + NOTE_DURATION_S + 0.02);
  });
}
