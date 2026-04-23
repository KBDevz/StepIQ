import { useState, useRef, useCallback, useEffect } from 'react';
import type { TestState, AIReport } from '../../types';
import { calcVO2Max, classify, calculateHRZones, CLASSIFICATION_NAMES } from '../../utils/scoring';
import { buildReportPrompt } from '../../utils/reportPrompt';
import { saveTestResult } from '../../lib/testResults';
import ProgressDots from './ProgressDots';
import BackButton from './BackButton';
import Moment0 from './Moment0';
import Moment1 from './Moment1';
import Moment2 from './Moment2';
import Moment3 from './Moment3';
import Moment4 from './Moment4';
import Moment5 from './Moment5';
import Moment6 from './Moment6';
import RegressionChart from '../results/RegressionChart';
import APIKeyModal from '../results/APIKeyModal';

interface ResultsCarouselProps {
  state: TestState;
  stopReason: string;
  onNewTest: () => void;
  isLoggedIn?: boolean;
  userId?: string | null;
  userProfile?: { first_name: string; last_name: string; email: string } | null;
  onOpenSignIn?: (prefillEmail?: string) => void;
  signUpFromLead?: (params: {
    email: string;
    firstName: string;
    lastName: string;
    mobile?: string;
    smsOptIn?: boolean;
  }) => Promise<{ error: string | null; user: any; isDuplicate: boolean }>;
}

type Direction = 'forward' | 'back';

const TOTAL_MOMENTS = 7; // 0-6
const TRANSITION_DURATION = 350;

export default function ResultsCarousel({
  state,
  stopReason,
  onNewTest,
  isLoggedIn,
  userId,
  userProfile,
  onOpenSignIn,
  signUpFromLead,
}: ResultsCarouselProps) {
  const [currentMoment, setCurrentMoment] = useState(0);
  const [direction, setDirection] = useState<Direction>('forward');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevMoment, setPrevMoment] = useState<number | null>(null);

  // Lead capture state
  const [firstName, setFirstName] = useState(userProfile?.first_name || state.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(userProfile?.last_name || state.name?.split(' ').slice(1).join(' ') || '');
  const [hasSubmittedContact, setHasSubmittedContact] = useState(!!isLoggedIn);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);

  // Report state
  const [apiKey, setApiKey] = useState<string>(import.meta.env.VITE_ANTHROPIC_API_KEY || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [report, setReport] = useState<AIReport | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Computed values
  const vo2Max = calcVO2Max(state.data, state.maxHR);
  const classification = classify(vo2Max, state.age, state.sex);
  const hrZones = calculateHRZones(state.maxHR, vo2Max, state.restingHR, state.betaBlocker);

  // Swipe handling
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Report generation
  const generateReport = useCallback(
    async (key: string) => {
      setReportLoading(true);
      setReportError(null);
      setShowKeyModal(false);

      try {
        const prompt = buildReportPrompt(state, vo2Max, classification, stopReason);
        const models = ['claude-sonnet-4-6', 'claude-sonnet-4-5-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-5-sonnet-latest'];
        let res: Response | null = null;
        let lastError = '';

        for (const model of models) {
          res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': key,
              'anthropic-version': '2023-06-01',
              'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({ model, max_tokens: 1800, messages: [{ role: 'user', content: prompt }] }),
          });

          if (res.status === 401 || res.status === 403) {
            setApiKey('');
            setKeyError('Invalid API key. Please try again.');
            setShowKeyModal(true);
            setReportLoading(false);
            return;
          }
          if (res.ok) break;
          if (res.status === 404) { lastError = `Model ${model} not available`; continue; }
          const errBody = await res.text();
          throw new Error(`API error ${res.status}: ${errBody.slice(0, 200)}`);
        }

        if (!res || !res.ok) throw new Error(lastError || 'No available model found');
        const body = await res.json();
        const text = body.content?.[0]?.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found in response');
        const parsed: AIReport = JSON.parse(jsonMatch[0]);
        setReport(parsed);
        setApiKey(key);
      } catch (err: any) {
        setReportError(err.message || 'Failed to generate report');
      } finally {
        setReportLoading(false);
      }
    },
    [state, vo2Max, classification, stopReason],
  );

  const handleGenerateClick = useCallback(() => {
    if (apiKey) generateReport(apiKey);
    else setShowKeyModal(true);
  }, [apiKey, generateReport]);

  // Auto-generate for logged-in users
  const autoGenRef = useRef(false);
  useEffect(() => {
    if (isLoggedIn && userId && !autoGenRef.current) {
      autoGenRef.current = true;
      saveTestResult(userId, state, vo2Max, classification, stopReason)
        .then(({ id }) => { if (id) console.log('Test result saved:', id); });
      handleGenerateClick();
    }
  }, [isLoggedIn, userId, state, vo2Max, classification, stopReason, handleGenerateClick]);

  // Navigation
  const goTo = useCallback((moment: number, dir: Direction) => {
    if (isTransitioning) return;
    if (moment < 0 || moment >= TOTAL_MOMENTS) return;

    setIsTransitioning(true);
    setDirection(dir);
    setPrevMoment(currentMoment);
    setCurrentMoment(moment);

    setTimeout(() => {
      setIsTransitioning(false);
      setPrevMoment(null);
    }, TRANSITION_DURATION + 100);
  }, [currentMoment, isTransitioning]);

  const goForward = useCallback(() => {
    if (currentMoment < TOTAL_MOMENTS - 1) goTo(currentMoment + 1, 'forward');
  }, [currentMoment, goTo]);

  const goBack = useCallback(() => {
    if (currentMoment > 0) goTo(currentMoment - 1, 'back');
  }, [currentMoment, goTo]);

  // Touch gestures
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) > 50 && Math.abs(dy) < Math.abs(dx)) {
      // Ignore swipe in Moment 6 (scrollable content)
      if (currentMoment === 6) return;
      if (dx < 0) goForward();
      else goBack();
    }
  }, [currentMoment, goForward, goBack]);

  // Lead form handlers
  const handleLeadSubmit = async (data: { firstName: string; lastName: string; email: string; phone: string; smsOptIn: boolean }) => {
    setAuthError(null);
    setIsDuplicateEmail(false);
    setFirstName(data.firstName);
    setLastName(data.lastName);

    if (signUpFromLead) {
      setReportLoading(true);
      const result = await signUpFromLead({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        mobile: data.phone || undefined,
        smsOptIn: data.smsOptIn,
      });

      if (result.error) {
        setReportLoading(false);
        if (result.isDuplicate) {
          setAuthError('An account with this email already exists.');
          setIsDuplicateEmail(true);
        } else {
          setAuthError(result.error);
        }
        return;
      }

      if (result.user) {
        const saveResult = await saveTestResult(result.user.id, state, vo2Max, classification, stopReason);
        if (saveResult.id) console.log('Test result saved:', saveResult.id);
      }

      setReportLoading(false);
    }

    setHasSubmittedContact(true);
    handleGenerateClick();
    goForward();
  };

  const handleSkip = () => {
    handleGenerateClick();
    goForward();
  };

  const handleSignInInstead = () => {
    if (onOpenSignIn) onOpenSignIn();
  };

  // Get transition styles
  const getTransitionStyle = (momentIdx: number): React.CSSProperties => {
    const isCurrent = momentIdx === currentMoment;
    const isPrev = momentIdx === prevMoment;

    if (!isTransitioning) {
      return {
        position: 'absolute',
        inset: 0,
        opacity: isCurrent ? 1 : 0,
        transform: 'translateX(0)',
        pointerEvents: isCurrent ? 'auto' : 'none',
        zIndex: isCurrent ? 1 : 0,
      };
    }

    if (isPrev) {
      const x = direction === 'forward' ? '-30px' : '30px';
      return {
        position: 'absolute',
        inset: 0,
        opacity: 0,
        transform: `translateX(${x})`,
        transition: `opacity 0.25s ease, transform 0.25s ease`,
        pointerEvents: 'none',
        zIndex: 0,
      };
    }

    if (isCurrent) {
      return {
        position: 'absolute',
        inset: 0,
        opacity: 1,
        transform: 'translateX(0)',
        transition: `opacity 0.35s cubic-bezier(0.32, 0.72, 0, 1) 0.1s, transform 0.35s cubic-bezier(0.32, 0.72, 0, 1) 0.1s`,
        pointerEvents: 'auto',
        zIndex: 1,
      };
    }

    return {
      position: 'absolute',
      inset: 0,
      opacity: 0,
      pointerEvents: 'none',
      zIndex: 0,
    };
  };

  // Initial transform for incoming card
  const getInitialTransform = (momentIdx: number): string => {
    if (isTransitioning && momentIdx === currentMoment) {
      return direction === 'forward' ? 'translateX(30px)' : 'translateX(-30px)';
    }
    return 'translateX(0)';
  };

  // Render a moment
  const renderMoment = (idx: number) => {
    switch (idx) {
      case 0: return <Moment0 onAdvance={goForward} />;
      case 1: return <Moment1 vo2Max={vo2Max} classification={classification} onContinue={goForward} />;
      case 2: return <Moment2 classification={classification} age={state.age} sex={state.sex} onContinue={goForward} />;
      case 3: return <Moment3 data={state.data} maxHR={state.maxHR} vo2Max={vo2Max} onContinue={goForward} />;
      case 4: return <Moment4 zones={hrZones} betaBlocker={state.betaBlocker} onContinue={goForward} />;
      case 5: return (
        <Moment5
          classification={classification}
          age={state.age}
          onSubmit={handleLeadSubmit}
          onSkip={handleSkip}
          defaultFirstName={firstName}
          defaultLastName={lastName}
          loading={reportLoading}
          authError={authError}
          onSignInInstead={isDuplicateEmail ? handleSignInInstead : undefined}
        />
      );
      case 6: return (
        <Moment6
          firstName={firstName}
          report={report}
          loading={reportLoading}
          reportError={reportError}
          vo2Max={vo2Max}
          classification={classification}
          hasSubmittedContact={hasSubmittedContact}
          age={state.age}
          sex={state.sex}
          data={state.data}
          maxHR={state.maxHR}
          onNewTest={onNewTest}
          onRetryReport={handleGenerateClick}
        />
      );
      default: return null;
    }
  };

  // Desktop side panel content
  const renderDesktopPanel = () => {
    const scaleColors = ['#FF4444', '#FF8C42', '#FFD166', '#06D6A0', '#00E5A0'];
    const activeIdx = CLASSIFICATION_NAMES.indexOf(classification.name as typeof CLASSIFICATION_NAMES[number]);
    const vo2Display = Math.round(vo2Max * 10) / 10;

    return (
      <div style={{ padding: '32px', overflowY: 'auto', height: '100%' }}>
        {/* Score */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text2)', marginBottom: '8px' }}>
            VO&#x2082; Max
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 700, color: classification.color, lineHeight: 1 }}>
            {vo2Display}
          </p>
          <span style={{
            display: 'inline-block',
            marginTop: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: classification.color,
            background: classification.bgColor,
            padding: '5px 16px',
            borderRadius: '20px',
          }}>
            {classification.name}
          </span>
        </div>

        {/* Scale bar */}
        <div style={{ maxWidth: '320px', margin: '0 auto 24px' }}>
          <div style={{ display: 'flex', gap: '3px', borderRadius: '6px', overflow: 'hidden', marginBottom: '6px' }}>
            {CLASSIFICATION_NAMES.map((name, i) => (
              <div key={name} style={{
                flex: 1,
                height: i === activeIdx ? '8px' : '5px',
                background: i === activeIdx ? scaleColors[i] : `${scaleColors[i]}30`,
                alignSelf: 'center',
                borderRadius: '3px',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '3px' }}>
            {CLASSIFICATION_NAMES.map((name, i) => (
              <p key={name} style={{
                flex: 1,
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.45rem',
                color: i === activeIdx ? scaleColors[i] : 'var(--text3)',
                fontWeight: i === activeIdx ? 700 : 400,
              }}>
                {name}
              </p>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="desktop-panel-chart" style={{ marginBottom: '20px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text2)', marginBottom: '8px' }}>
            HR vs VO&#x2082; Regression
          </p>
          <RegressionChart data={state.data} maxHR={state.maxHR} vo2Max={vo2Max} />
        </div>

        {/* Level data */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text2)', marginBottom: '8px' }}>
            Level Data
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
            <thead>
              <tr style={{ color: 'var(--text2)' }}>
                <th style={{ textAlign: 'left', padding: '6px 0', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>Level</th>
                <th style={{ textAlign: 'right', padding: '6px 0', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>HR</th>
                <th style={{ textAlign: 'right', padding: '6px 0', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>RPE</th>
                <th style={{ textAlign: 'right', padding: '6px 0', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>VO&#x2082;</th>
              </tr>
            </thead>
            <tbody>
              {state.data.map((d, i) => (
                <tr key={d.level} style={{ background: i % 2 === 1 ? 'rgba(10,18,32,0.5)' : 'transparent' }}>
                  <td style={{ padding: '8px 0', color: 'var(--text)' }}>{d.level}</td>
                  <td style={{ textAlign: 'right', padding: '8px 0', color: 'var(--text)' }}>{d.hr}</td>
                  <td style={{ textAlign: 'right', padding: '8px 0', color: d.rpe >= 8 ? '#FF8C42' : 'var(--text)' }}>{d.rpe}</td>
                  <td style={{ textAlign: 'right', padding: '8px 0', color: 'var(--text)' }}>{d.vo2Estimate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { label: 'Max HR', value: `${state.maxHR}`, unit: 'bpm' },
            { label: 'Levels', value: `${state.data.length}`, unit: 'of 5' },
            { label: 'Age', value: `${state.age}`, unit: '' },
            { label: 'Formula', value: state.betaBlocker ? 'Londeree' : '220-age', unit: '' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '12px',
            }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text2)', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>
                {stat.value}
                {stat.unit && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text2)', marginLeft: '4px', fontWeight: 400 }}>{stat.unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="results-carousel-root" style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(28,47,74,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(28,47,74,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Desktop layout wrapper */}
      <div className="carousel-layout" style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Phone frame (carousel) */}
        <div
          ref={carouselRef}
          className="carousel-phone-frame"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            maxWidth: '460px',
            overflow: 'hidden',
            background: 'var(--bg)',
          }}
        >
          {/* Progress dots — shown on Moments 1-6 */}
          {currentMoment > 0 && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
              <ProgressDots current={currentMoment} total={6} />
            </div>
          )}

          {/* Back button — shown on Moments 1-6 */}
          {currentMoment > 0 && (
            <BackButton onClick={goBack} />
          )}

          {/* Moment cards */}
          {Array.from({ length: TOTAL_MOMENTS }).map((_, idx) => {
            const isCurrent = idx === currentMoment;
            const isPrev = idx === prevMoment;
            if (!isCurrent && !isPrev) return null;

            return (
              <div
                key={idx}
                style={{
                  ...getTransitionStyle(idx),
                  ...(isTransitioning && isCurrent ? {
                    transform: getInitialTransform(idx),
                    animation: `slideIn${direction === 'forward' ? 'Left' : 'Right'} ${TRANSITION_DURATION}ms cubic-bezier(0.32, 0.72, 0, 1) forwards`,
                    animationDelay: '100ms',
                  } : {}),
                }}
              >
                {renderMoment(idx)}
              </div>
            );
          })}
        </div>

        {/* Desktop side panel */}
        <div className="carousel-desktop-panel" style={{
          display: 'none',
          width: '40%',
          maxWidth: '480px',
          height: '100%',
          borderLeft: '1px solid var(--border)',
          background: 'var(--surface)',
          overflow: 'hidden',
        }}>
          {renderDesktopPanel()}
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <APIKeyModal
          onSubmit={(key) => { setKeyError(null); generateReport(key); }}
          onClose={() => setShowKeyModal(false)}
          error={keyError}
        />
      )}

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @keyframes slideInLeft {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        /* Desktop: show phone frame + side panel */
        @media (min-width: 1024px) {
          .carousel-phone-frame {
            max-width: 460px !important;
            height: 85vh !important;
            max-height: 900px !important;
            border-radius: 32px !important;
            border: 2px solid var(--border) !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4) !important;
            overflow: hidden !important;
          }
          .carousel-desktop-panel {
            display: block !important;
            height: 85vh !important;
            max-height: 900px !important;
            border-radius: 0 32px 32px 0 !important;
            border: 2px solid var(--border) !important;
            border-left: none !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4) !important;
          }
          .carousel-phone-frame {
            border-radius: 32px 0 0 32px !important;
          }
        }

        /* Desktop panel chart overrides */
        .desktop-panel-chart .w-full {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          backdrop-filter: none !important;
        }
        .desktop-panel-chart > div > div {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
}
