// Sons synthétiques via Web Audio API — aucun fichier externe requis

type OscType = "sine" | "square" | "sawtooth" | "triangle";

function note(ac: AudioContext, freq: number, start: number, dur: number, vol: number, type: OscType = "sine") {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + start);
  gain.gain.setValueAtTime(0, ac.currentTime + start);
  gain.gain.linearRampToValueAtTime(vol, ac.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.05);
}

let _muted = false;
export function setSoundMuted(muted: boolean) { _muted = muted; }

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

// Arpège ascendant joyeux : Do-Mi-Sol-Do
export function playVictory() {
  if (_muted) return;
  try {
    const ac = getCtx();
    const melody = [523, 659, 784, 1047]; // C5 E5 G5 C6
    melody.forEach((freq, i) => {
      note(ac, freq, i * 0.12, 0.35, 0.14);
      note(ac, freq * 2, i * 0.12, 0.20, 0.04); // shimmer octave
    });
    // Accord final plein
    [523, 659, 784].forEach((freq) => note(ac, freq, 0.52, 0.55, 0.10));
  } catch { /* silencieux si bloqué */ }
}

// Descente sombre : tierce mineure vers le bas
export function playDefeat() {
  if (_muted) return;
  try {
    const ac = getCtx();
    const melody = [392, 349, 311, 261]; // G4 F4 Eb4 C4
    melody.forEach((freq, i) => {
      note(ac, freq, i * 0.16, 0.30, 0.12, "triangle");
    });
    // Note basse finale longue
    note(ac, 196, 0.68, 0.7, 0.10, "triangle");
  } catch { /* silencieux si bloqué */ }
}

export function playReveal() {
  if (_muted) return;
  try {
    const ac = getCtx();

    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const osc2 = ac.createOscillator();
    const gain2 = ac.createGain();

    // Ton principal : montée rapide de 520 Hz à 780 Hz
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(780, ac.currentTime + 0.08);

    gain.gain.setValueAtTime(0, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ac.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.22);

    // Harmonique légère pour donner du corps
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1040, ac.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1560, ac.currentTime + 0.08);

    gain2.gain.setValueAtTime(0, ac.currentTime);
    gain2.gain.linearRampToValueAtTime(0.06, ac.currentTime + 0.012);
    gain2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);

    osc.connect(gain).connect(ac.destination);
    osc2.connect(gain2).connect(ac.destination);

    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.25);
    osc2.start(ac.currentTime);
    osc2.stop(ac.currentTime + 0.20);
  } catch {
    // Silencieux si le navigateur bloque l'audio
  }
}
