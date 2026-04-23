import { toPng } from 'html-to-image';

export async function generateShareImage(
  format: 'square' | 'story' | 'challenge',
): Promise<string> {
  const id = format === 'challenge' ? 'share-card-challenge' : format === 'story' ? 'share-card-story' : 'share-card-square';
  const el = document.getElementById(id);
  if (!el) throw new Error('Share card element not found');

  const w = 1080;
  const h = format === 'story' ? 1920 : 1080;

  return toPng(el, { quality: 1.0, pixelRatio: 2, width: w, height: h });
}

export async function shareOrDownload(
  dataUrl: string,
  vo2Max: number,
  classification: string,
): Promise<void> {
  const blob = await (await fetch(dataUrl)).blob();
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `stepiq-score-${Math.round(vo2Max * 10) / 10}-${dateStr}.png`;
  const file = new File([blob], filename, { type: 'image/png' });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: 'My VO₂ Max Score — StepIQ',
      text: `I just estimated my VO₂ max with StepIQ — ${(Math.round(vo2Max * 10) / 10).toFixed(1)} ml/kg/min, classified as ${classification}.`,
      files: [file],
    });
  } else {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }
}
