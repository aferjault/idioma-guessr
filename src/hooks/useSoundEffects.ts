// Effets sonores générés via Web Audio API — aucun fichier audio requis

let _muted = false;
export function setSoundMuted(muted: boolean) { _muted = muted; }

function getCtx(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as never as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playTone(
  freq: number,
  type: OscillatorType,
  duration: number,
  volume: number,
  freqEnd?: number
) {
  if (_muted) return;
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);
  }

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export const SoundEffects = {
  // Son doux à chaque mot révélé
  wordReveal() {
    playTone(880, "sine", 0.18, 0.06, 1100);
  },

  // Accord montant pour bonne réponse
  correct() {
    playTone(523, "sine", 0.15, 0.08);
    setTimeout(() => playTone(659, "sine", 0.15, 0.08), 80);
    setTimeout(() => playTone(784, "sine", 0.25, 0.1), 160);
  },

  // Ton descendant pour mauvaise réponse
  wrong() {
    playTone(350, "triangle", 0.12, 0.07, 220);
    setTimeout(() => playTone(220, "triangle", 0.2, 0.07), 120);
  },
};
