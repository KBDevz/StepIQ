// Voice coaching using Web Speech API
// Syncs with metronome beats to call out step directions

let preferredVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function loadVoice() {
  if (voicesLoaded) return;
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return;
  voicesLoaded = true;

  // Prefer natural-sounding en-US voices
  const preferred = ['Samantha', 'Alex', 'Karen', 'Daniel', 'Google US English', 'Microsoft Zira'];
  for (const name of preferred) {
    const match = voices.find((v) => v.name.includes(name) && v.lang.startsWith('en'));
    if (match) { preferredVoice = match; return; }
  }
  // Fallback: any en-US voice
  const enUS = voices.find((v) => v.lang === 'en-US');
  if (enUS) preferredVoice = enUS;
}

// Ensure voices are loaded (some browsers load async)
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = loadVoice;
  loadVoice();
}

function speak(text: string, rate = 1.0) {
  if (typeof speechSynthesis === 'undefined') return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = 1.0;
    u.volume = 0.9;
    if (preferredVoice) u.voice = preferredVoice;
    speechSynthesis.speak(u);
  } catch {
    // Swallow speech errors silently
  }
}

export function cancelSpeech() {
  if (typeof speechSynthesis !== 'undefined') {
    try { speechSynthesis.cancel(); } catch { /* ignore */ }
  }
}

const BEAT_WORDS = ['Up', 'Up', 'Down', 'Down'];
const COACHING_BEATS = 16; // 4 cycles × 4 beats

/**
 * Called on each metronome beat. Speaks step directions
 * for the first 4 cycles, then the transition phrase.
 */
export function onBeat(beatsSinceLevelStart: number, currentLevel: number) {
  if (beatsSinceLevelStart < COACHING_BEATS) {
    const word = BEAT_WORDS[beatsSinceLevelStart % 4];
    speak(word, 1.2); // slightly faster for crisp beat-sync
  } else if (beatsSinceLevelStart === COACHING_BEATS) {
    speak(`Continue at this pace through Level ${currentLevel}`);
  }
}

/**
 * Speak the 10-second warning alert
 */
export function speakHRAlert() {
  cancelSpeech();
  speak('Check your heart rate now. Record it before the level ends.');
}
