import { useState, useCallback } from 'react';
import type { LevelResult, ClassificationResult } from '../../types';
import ShareCard from './ShareCard';
import { generateShareImage, shareOrDownload } from '../../utils/shareCard';

interface ShareSectionProps {
  vo2Max: number;
  classification: ClassificationResult;
  age: number;
  sex: 'male' | 'female';
  levelsCompleted: number;
  data: LevelResult[];
  maxHR: number;
}

type Format = 'square' | 'story' | 'challenge';

export default function ShareSection({ vo2Max, classification, age, sex, levelsCompleted, data, maxHR }: ShareSectionProps) {
  const [format, setFormat] = useState<Format>('square');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    setLoading(true);
    try {
      const dataUrl = await generateShareImage(format);
      await shareOrDownload(dataUrl, vo2Max, classification.name);
    } catch (e) {
      console.error('Share failed:', e);
    } finally {
      setLoading(false);
    }
  }, [format, vo2Max, classification.name]);

  const copyHashtags = useCallback(() => {
    navigator.clipboard?.writeText('#StepIQ #VO2Max #CardiovascularFitness');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const cardProps = { vo2Max, classification, age, sex, levelsCompleted, data, maxHR };
  const formats: { key: Format; label: string }[] = [
    { key: 'square', label: 'Square' },
    { key: 'story', label: 'Story' },
    { key: 'challenge', label: 'Challenge' },
  ];

  return (
    <>
      {/* Hidden share cards for capture */}
      <ShareCard format="square" {...cardProps} />
      <ShareCard format="story" {...cardProps} />
      <ShareCard format="challenge" {...cardProps} />

      {/* Visible section */}
      <div style={{
        background: '#0D1829',
        border: '1px solid #1C2F4A',
        borderRadius: '16px',
        padding: '24px',
        marginTop: '24px',
      }}>
        <h3 style={{
          fontFamily: 'Libre Baskerville, serif',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#EEF2FF',
          marginBottom: '4px',
        }}>
          Share Your Score
        </h3>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.78rem',
          color: '#5A7090',
          marginBottom: '20px',
        }}>
          Show the world where you stand.
        </p>

        {/* Preview */}
        <div style={{
          width: format === 'story' ? '120px' : '200px',
          aspectRatio: format === 'story' ? '9/16' : '1/1',
          margin: '0 auto 16px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          background: classification.name === 'Excellent' || classification.name === 'Good'
            ? 'linear-gradient(135deg, #003D35 0%, #001A14 50%, #060C18 100%)'
            : classification.name === 'Average'
              ? 'linear-gradient(135deg, #3D2E00 0%, #1A1400 50%, #060C18 100%)'
              : classification.name === 'Below Average'
                ? 'linear-gradient(135deg, #3D1A00 0%, #1A0C00 50%, #060C18 100%)'
                : 'linear-gradient(135deg, #3D0000 0%, #1A0000 50%, #060C18 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }} />
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.4rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: classification.color,
            opacity: 0.7,
            marginBottom: '2px',
            position: 'relative',
          }}>
            My VO₂ Max
          </span>
          <span style={{
            fontFamily: 'Libre Baskerville, serif',
            fontSize: format === 'story' ? '2rem' : '2.8rem',
            fontWeight: 700,
            color: classification.color,
            lineHeight: 1,
            textShadow: `0 0 20px ${classification.color}66`,
            position: 'relative',
          }}>
            {(Math.round(vo2Max * 10) / 10).toFixed(1)}
          </span>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.35rem',
            color: 'rgba(255,255,255,0.5)',
            position: 'relative',
          }}>
            ml · kg⁻¹ · min⁻¹
          </span>
          <div style={{
            marginTop: '6px',
            padding: '2px 8px',
            borderRadius: '20px',
            background: `${classification.color}26`,
            border: `1px solid ${classification.color}`,
            position: 'relative',
          }}>
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.35rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: classification.color,
            }}>
              {classification.name}
            </span>
          </div>
          {format === 'challenge' && (
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.35rem',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.6)',
              marginTop: '8px',
              textAlign: 'center',
              position: 'relative',
            }}>
              Do you know yours?
            </p>
          )}
        </div>

        {/* Format buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {formats.map((f) => (
            <button
              key={f.key}
              onClick={() => setFormat(f.key)}
              style={{
                flex: 1,
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.68rem',
                fontWeight: format === f.key ? 600 : 400,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: format === f.key ? '#EEF2FF' : '#5A7090',
                background: format === f.key ? 'rgba(0,184,162,0.12)' : 'transparent',
                border: `1px solid ${format === f.key ? 'rgba(0,184,162,0.3)' : '#1C2F4A'}`,
                borderRadius: '8px',
                padding: '10px 8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          disabled={loading}
          style={{
            width: '100%',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.78rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#060C18',
            background: '#00B8A2',
            border: 'none',
            borderRadius: '10px',
            padding: '15px 24px',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 0 24px rgba(0,184,162,0.2)',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Generating...' : 'Share My Score →'}
        </button>

        {/* Hashtags */}
        <p
          onClick={copyHashtags}
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.6rem',
            color: '#5A7090',
            textAlign: 'center',
            marginTop: '12px',
            cursor: 'pointer',
          }}
        >
          {copied ? 'Copied!' : '#StepIQ #VO2Max #CardiovascularFitness'}
        </p>
      </div>
    </>
  );
}
