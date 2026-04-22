let preferredVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function scoreVoice(v: SpeechSynthesisVoice): number {
  if (!v.lang.startsWith('en')) return -1;
  const n = v.name.toLowerCase();
  let score = 0;

  if (n.includes('premium')) score += 100;
  if (n.includes('enhanced')) score += 80;
  if (n.includes('natural')) score += 70;
  if (n.includes('neural')) score += 60;

  const highQuality = ['zoe', 'ava', 'evan', 'tom', 'samantha', 'karen', 'daniel', 'fiona', 'moira'];
  for (const name of highQuality) {
    if (n.includes(name)) { score += 40; break; }
  }

  if (n.includes('google us english')) score += 30;
  if (n.includes('google uk english')) score += 28;
  if (n.includes('microsoft') && (n.includes('aria') || n.includes('jenny') || n.includes('guy'))) score += 35;

  if (v.lang === 'en-US') score += 10;
  else if (v.lang === 'en-GB') score += 8;
  else if (v.lang.startsWith('en-')) score += 5;

  if (!v.localService) score += 2;

  return score;
}

function loadVoice() {
  if (voicesLoaded) return;
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return;
  voicesLoaded = true;

  const scored = voices
    .map((v) => ({ voice: v, score: scoreVoice(v) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    preferredVoice = scored[0].voice;
  }
}

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
    // swallow
  }
}

export function cancelSpeech() {
  if (typeof speechSynthesis !== 'undefined') {
    try { speechSynthesis.cancel(); } catch { /* ignore */ }
  }
}

export function speakText(text: string, rate = 0.95) {
  if (typeof speechSynthesis === 'undefined') return;
  cancelSpeech();
  try {
    loadVoice();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = 1.0;
    u.volume = 0.9;
    if (preferredVoice) u.voice = preferredVoice;
    speechSynthesis.speak(u);
  } catch {
    // swallow
  }
}

const BEAT_WORDS = ['Up', 'Up', 'Down', 'Down'];
const COACHING_BEATS = 16;

export function onBeat(beatsSinceLevelStart: number, currentLevel: number) {
  if (typeof speechSynthesis === 'undefined') return;
  // Don't queue speech if already speaking — prevents pile-up that blocks audio
  if (speechSynthesis.speaking) return;

  if (beatsSinceLevelStart < COACHING_BEATS) {
    const word = BEAT_WORDS[beatsSinceLevelStart % 4];
    speak(word, 1.2);
  } else if (beatsSinceLevelStart === COACHING_BEATS) {
    speak(`Continue at this pace through Level ${currentLevel}`);
  }
}

export function speakHRAlert() {
  cancelSpeech();
  speak('Check your heart rate now. Record it before the level ends.');
}
