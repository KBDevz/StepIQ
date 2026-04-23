import { useEffect, useRef, useState } from 'react';
import type { AIReport, ClassificationResult, LevelResult } from '../../types';
import FormCard from '../ui/FormCard';
import ShareSection from '../results/ShareSection';

interface Moment6Props {
  firstName: string;
  report: AIReport | null;
  loading: boolean;
  reportError: string | null;
  vo2Max: number;
  classification: ClassificationResult;
  hasSubmittedContact: boolean;
  age: number;
  sex: 'male' | 'female';
  data: LevelResult[];
  maxHR: number;
  onNewTest: () => void;
  onRetryReport: () => void;
}

function SectionReveal({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function Moment6({
  firstName,
  report,
  loading,
  reportError,
  vo2Max,
  classification,
  hasSubmittedContact,
  age,
  sex,
  data,
  maxHR,
  onNewTest,
  onRetryReport,
}: Moment6Props) {
  const vo2Display = Math.round(vo2Max * 10) / 10;

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      padding: '80px 24px 40px',
    }}>
      {/* Success message */}
      {hasSubmittedContact && firstName && (
        <SectionReveal delay={0}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'var(--accent)',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            Report unlocked, {firstName} &#127881;
          </p>
        </SectionReveal>
      )}

      {/* Loading state */}
      {loading && !report && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(0,184,162,0.1)',
            border: '1px solid rgba(0,184,162,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1.5s linear infinite' }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
            Generating your report{firstName ? `, ${firstName}` : ''}...
          </h3>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text2)', lineHeight: 1.7 }}>
            Our AI is analyzing your test data and building a personalized protocol.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', height: '40px', marginTop: '20px' }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ width: '3px', borderRadius: '2px', background: 'var(--accent)', animation: `waveform 1.2s ease-in-out ${i * 0.06}s infinite`, opacity: 0.6 }} />
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {reportError && !loading && !report && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
            Something went wrong
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#FF4444', lineHeight: 1.7, marginBottom: '16px' }}>
            {reportError}
          </p>
          <button
            onClick={onRetryReport}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--accent)',
              background: 'var(--surface)',
              border: '1px solid rgba(0,184,162,0.3)',
              borderRadius: '10px',
              padding: '10px 20px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Report content */}
      {report && (
        <>
          {/* Compact score summary */}
          <SectionReveal delay={0}>
            <FormCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: classification.color }}>
                  {vo2Display}
                </span>
                <div>
                  <span style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: classification.color,
                    background: classification.bgColor,
                    padding: '3px 10px',
                    borderRadius: '6px',
                  }}>
                    {classification.name}
                  </span>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text2)', marginTop: '2px' }}>ml/kg/min</p>
                </div>
              </div>
            </FormCard>
          </SectionReveal>

          {/* What Your Score Means */}
          <SectionReveal delay={0.1}>
            <div style={{ marginTop: '12px' }}>
              <FormCard>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '8px' }}>
                  What Your Score Means
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'rgba(238,242,255,0.8)', lineHeight: 1.6 }}>
                  {report.score_meaning}
                </p>
              </FormCard>
            </div>
          </SectionReveal>

          {/* Key Observations */}
          <SectionReveal delay={0.2}>
            <div style={{ marginTop: '12px' }}>
              <FormCard>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '10px' }}>
                  Key Observations
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {report.observations.map((obs, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ flexShrink: 0, width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', marginTop: '6px' }} />
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'rgba(238,242,255,0.8)', lineHeight: 1.6 }}>{obs}</p>
                    </div>
                  ))}
                </div>
              </FormCard>
            </div>
          </SectionReveal>

          {/* 8-Week Protocol */}
          <SectionReveal delay={0.3}>
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '10px', paddingLeft: '4px' }}>
                8-Week Improvement Protocol
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {report.protocol.map((week) => (
                  <FormCard key={week.weeks}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text)', fontWeight: 600 }}>{week.weeks}</span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.55rem',
                        textTransform: 'uppercase',
                        color: 'var(--accent)',
                        background: 'rgba(0,184,162,0.1)',
                        border: '1px solid rgba(0,184,162,0.2)',
                        borderRadius: '4px',
                        padding: '2px 8px',
                      }}>
                        {week.phase}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      {[
                        ['Exercise', week.exercise],
                        ['Duration', week.duration],
                        ['Intensity', week.intensity],
                        ['Frequency', week.frequency],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text2)' }}>{label}</p>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(238,242,255,0.8)', marginTop: '2px' }}>{value}</p>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text2)', fontStyle: 'italic' }}>{week.focus}</p>
                  </FormCard>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* Next Target */}
          <SectionReveal delay={0.4}>
            <div style={{ marginTop: '16px' }}>
              <FormCard>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '10px' }}>
                  Next Test Target
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>
                    {report.next_target.vo2_target}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text2)' }}>ml/kg/min</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', textTransform: 'uppercase', color: 'var(--text2)' }}>Target</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text)' }}>{report.next_target.classification}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', textTransform: 'uppercase', color: 'var(--text2)' }}>Improvement</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text)' }}>+{report.next_target.improvement_needed}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', textTransform: 'uppercase', color: 'var(--text2)' }}>Timeframe</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text)' }}>{report.next_target.timeframe}</p>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'rgba(238,242,255,0.8)', fontStyle: 'italic', lineHeight: 1.5 }}>
                  {report.next_target.closing}
                </p>
              </FormCard>
            </div>
          </SectionReveal>

          {/* Share section */}
          <SectionReveal delay={0.5}>
            <div style={{ marginTop: '16px' }}>
              <ShareSection
                vo2Max={vo2Max}
                classification={classification}
                age={age}
                sex={sex}
                levelsCompleted={data.length}
                data={data}
                maxHR={maxHR}
              />
            </div>
          </SectionReveal>
        </>
      )}

      {/* Bottom actions */}
      <div style={{ marginTop: '24px', textAlign: 'center', paddingBottom: '20px' }}>
        <button
          type="button"
          onClick={onNewTest}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text2)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; }}
        >
          Start New Test
        </button>
      </div>

      {/* Clinical disclaimer */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.52rem',
        color: 'var(--text3)',
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 1.6,
        padding: '0 8px 24px',
      }}>
        VO&#x2082; max estimate based on the Chester Step Test protocol (Sykes &amp; Roberts, 2004). Typically accurate to &plusmn;3-4 ml/kg/min.
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes waveform {
          0%, 100% { height: 4px; opacity: 0.3; }
          50% { height: 28px; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
