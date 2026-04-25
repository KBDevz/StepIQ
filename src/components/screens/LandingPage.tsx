import { useState, useEffect, useRef, useCallback } from 'react';
import NavBar from '../ui/NavBar';
import ThemeToggle from '../ui/ThemeToggle';

interface LandingPageProps {
  onStart: () => void;
  onHowItWorks: () => void;
  authNavProps?: { userName: string | null; onSignIn: () => void; onSignOut: () => void };
}

/* ─────────────────────────────────────────────
   Main Landing Page
   ───────────────────────────────────────────── */
export default function LandingPage({ onStart, onHowItWorks, authNavProps }: LandingPageProps) {
  const [showSticky, setShowSticky] = useState(false);
  const heroCTARef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!heroCTARef.current) return;
    const heroBottom = heroCTARef.current.getBoundingClientRect().bottom;
    const pastHero = heroBottom < 0;
    const finalCTA = document.querySelector('[data-final-cta]');
    let nearFinal = false;
    if (finalCTA) {
      const rect = finalCTA.getBoundingClientRect();
      nearFinal = Math.abs(rect.top - window.innerHeight) < 200;
    }
    const distFromBottom = document.body.scrollHeight - window.scrollY - window.innerHeight;
    setShowSticky(pastHero && !nearFinal && distFromBottom > 200);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <NavBar onStart={onStart} onHowItWorks={onHowItWorks} {...authNavProps} />

      {/* ── HERO ── */}
      <section
        className="hero relative z-10"
        style={{ marginTop: '64px' }}
      >
        <div
          className="landing-hero-container"
          style={{
            width: '100%',
            maxWidth: '720px',
            margin: '0 auto',
            padding: '56px 24px 40px',
          }}
        >
          {/* 1 — Eyebrow */}
          <div className="landing-stagger-1" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              Free · 10 Minutes · No Lab
            </span>
          </div>

          {/* 2 — Headline */}
          <h1
            className="landing-stagger-2 landing-headline"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
              margin: 0,
              marginBottom: '14px',
            }}
          >
            VO₂ max is the #1 predictor of how long you'll live.
          </h1>

          {/* 3 — Subhead */}
          <p
            className="landing-stagger-2 landing-subheadline"
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--accent)',
              lineHeight: 1.4,
              letterSpacing: '-0.01em',
              marginBottom: '18px',
            }}
          >
            This is the easiest way to measure yours.
          </p>

          {/* 4 — Blurb */}
          <p
            className="landing-stagger-3 landing-blurb"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text2)',
              lineHeight: 1.55,
              marginBottom: '22px',
            }}
          >
            StepIQ is a 10-minute guided step test you can take at home or at the gym. All you need is a step, a heart rate monitor, and your phone.
          </p>

          {/* 5 — Accuracy strip */}
          <div
            className="landing-stagger-3"
            style={{
              background: 'linear-gradient(90deg, rgba(20,230,180,0.08), rgba(20,230,180,0.02))',
              border: '1px solid rgba(20,230,180,0.15)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: '10px',
              padding: '14px 16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              marginBottom: '26px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>
              Accurate within <span style={{ color: 'var(--accent)', fontWeight: 700 }}>±8-10%</span> of a lab VO₂ test
            </span>
          </div>

          {/* 6 — Primary CTA */}
          <div ref={heroCTARef}>
            <button
              onClick={onStart}
              className="landing-cta-btn uppercase cursor-pointer transition-all landing-stagger-4"
              style={{
                fontFamily: 'var(--font-mono)',
                width: '100%',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: 'var(--bg)',
                background: 'var(--accent)',
                padding: '15px 24px',
                borderRadius: '10px',
                border: 'none',
                boxShadow: '0 8px 28px rgba(20,230,180,0.3)',
                marginBottom: '12px',
              }}
            >
              Start Free VO₂ Max Test →
            </button>
          </div>

          {/* 7 — Risk reversal */}
          <p
            className="uppercase landing-stagger-4"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              color: 'var(--text3)',
              textAlign: 'center',
              marginBottom: '28px',
            }}
          >
            No Credit Card · No Email · No Account
          </p>

          {/* 8 — Sample result preview */}
          <div className="landing-stagger-5" style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
              <span style={{ flex: '0 0 28px', height: '1px', background: 'var(--border)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text3)' }}>A Look at Your Result</span>
              <span style={{ flex: '0 0 28px', height: '1px', background: 'var(--border)' }} />
            </div>
            <div style={{
              background: 'linear-gradient(180deg, var(--surface) 0%, var(--surface2) 100%)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '24px 22px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              maxWidth: '560px',
              margin: '0 auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)' }}>Your VO₂ Max</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '999px', padding: '4px 12px' }}>Good</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 700, color: 'var(--accent)', lineHeight: 0.95 }}>41.2</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text3)' }}>ml · kg⁻¹ · min⁻¹</span>
              </div>
              <svg width="100%" height="90" viewBox="0 0 320 90" preserveAspectRatio="none" style={{ display: 'block', marginBottom: '12px' }}>
                <line x1="0" y1="30" x2="320" y2="30" stroke="var(--border)" strokeWidth="0.5" />
                <line x1="0" y1="60" x2="320" y2="60" stroke="var(--border)" strokeWidth="0.5" />
                <defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" /><stop offset="100%" stopColor="#3B82F6" stopOpacity="0" /></linearGradient></defs>
                <path d="M20 72 L90 58 L160 46 L230 34 L230 90 L20 90 Z" fill="url(#areaFill)" />
                <polyline points="20,72 90,58 160,46 230,34" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="230" y1="34" x2="300" y2="18" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
                <circle cx="20" cy="72" r="4" fill="#3B82F6" /><circle cx="90" cy="58" r="4" fill="#3B82F6" /><circle cx="160" cy="46" r="4" fill="#3B82F6" /><circle cx="230" cy="34" r="4" fill="#3B82F6" />
                <circle cx="300" cy="18" r="6" fill="var(--accent)" opacity="0.3" /><circle cx="300" cy="18" r="4" fill="var(--accent)" />
              </svg>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text3)', textAlign: 'center' }}>
                Sample Result · 4 of 5 Levels · Age 35 · Male
              </p>
            </div>
          </div>

          {/* 9 — Wedge card */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px',
            marginBottom: '28px',
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px' }}>
              vs Your Apple Watch
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text2)' }}>
              Your watch <strong style={{ color: 'var(--text)', fontWeight: 600 }}>estimates</strong> VO₂ max from passive movement. StepIQ <strong style={{ color: 'var(--text)', fontWeight: 600 }}>measures</strong> it from a clinically validated active protocol — the same method physiologists use.
            </p>
          </div>

          {/* 10 — Trust strip */}
          <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '18px 0', marginBottom: '26px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '8px 0' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', lineHeight: 1.45, color: 'var(--text2)' }}>
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Clinically validated</strong> — Chester Step Test, used in cardiac rehab worldwide
              </span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '8px 0' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', lineHeight: 1.45, color: 'var(--text2)' }}>
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Linear regression scoring</strong> — fits a line through 5 data points, the way physiologists do
              </span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '8px 0' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', lineHeight: 1.45, color: 'var(--text2)' }}>
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>AI-powered 8-week plan</strong> — personalized HR zones, protocol, and next-test target
              </span>
            </div>
          </div>

          {/* 11 — Citations */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '10px' }}>
              Research Cited In
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.84rem', fontStyle: 'italic', lineHeight: 1.6, color: 'var(--text2)' }}>
              JAMA · Mayo Clinic Proceedings · Occupational Medicine
            </p>
          </div>

          {/* 12 — Equipment grid */}
          <div style={{ marginBottom: '22px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text3)', textAlign: 'center', marginBottom: '14px' }}>
              What You'll Need
            </p>
            <div className="landing-equip-grid">
              {[
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: '10 Minutes', sub: 'to complete' },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, title: 'HR Monitor', sub: 'watch or strap' },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>, title: 'A Step', sub: '15-30cm, stairs work' },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>, title: 'Your Phone', sub: 'any browser' },
              ].map((item) => (
                <div key={item.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 12px', textAlign: 'center' }}>
                  <div style={{ marginBottom: '8px' }}>{item.icon}</div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{item.title}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text3)', lineHeight: 1.3 }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 13 — Secondary CTA */}
          <button
            data-final-cta
            onClick={() => document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="cursor-pointer uppercase"
            style={{
              width: '100%',
              padding: '14px',
              background: 'transparent',
              color: 'var(--accent)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              letterSpacing: '0.14em',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            See How It Works ↓
          </button>
        </div>
      </section>

      {/* ── WHO IS STEPIQ FOR? ── */}
      <section
        id="how-it-works-section"
        className="relative z-10"
        style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          className="landing-audience-container"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '80px 64px',
          }}
        >
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              color: 'var(--accent)',
              textAlign: 'center',
              marginBottom: '12px',
            }}
          >
            Who Is StepIQ For?
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--text)',
              textAlign: 'center',
              marginBottom: '40px',
              lineHeight: 1.2,
            }}
          >
            Built for Anyone Who Takes
            <br />
            Their Health Seriously
          </h2>

          <div className="landing-audience-grid">
            {[
              {
                accent: '#00B8A2',
                title: 'The Health Optimizer',
                body: 'You track your fitness seriously and want a more rigorous VO₂ max measurement than your wearable provides. StepIQ uses a clinically validated protocol — not an algorithm.',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00B8A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
              },
              {
                accent: '#4A9EFF',
                title: 'The Fitness Baseline Seeker',
                body: 'You want to know exactly where your cardiovascular fitness stands and have a science-backed plan to improve it. No lab required.',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4A9EFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                ),
              },
              {
                accent: '#FFD166',
                title: 'The Comeback Story',
                body: "You're returning to fitness after illness, injury, or a long break and want a safe, validated starting point. The test never pushes you to exhaustion.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFD166" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ),
              },
              {
                accent: '#FF8C42',
                title: 'Occupational Health',
                body: 'Your industry requires cardiovascular fitness screening. StepIQ follows the Chester Step Test protocol used in cardiac rehabilitation and occupational health worldwide.',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF8C42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                ),
              },
            ].map((card) => (
              <div
                key={card.title}
                className="landing-audience-card"
                style={{
                  position: 'relative',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '24px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, transform 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: card.accent,
                    borderRadius: '3px 3px 0 0',
                  }}
                />
                <div style={{ marginBottom: '14px' }}>{card.icon}</div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '8px',
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.78rem',
                    color: 'var(--text2)',
                    lineHeight: 1.7,
                  }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.78rem',
              color: 'var(--text2)',
              fontStyle: 'italic',
              textAlign: 'center',
              marginTop: '28px',
            }}
          >
            Not sure which category you're in? It doesn't matter — the test is the same for everyone.
          </p>
        </div>
      </section>

      {/* ── WHAT YOUR SCORE UNLOCKS ── */}
      <section
        className="relative z-10"
        style={{ padding: '0' }}
      >
        <div
          className="landing-unlocks-container"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '80px 64px',
          }}
        >
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              color: 'var(--accent)',
              textAlign: 'center',
              marginBottom: '12px',
            }}
          >
            What Your Score Unlocks
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--text)',
              textAlign: 'center',
              marginBottom: '48px',
              lineHeight: 1.2,
            }}
          >
            One Test. Three Outcomes.
          </h2>

          <div className="landing-unlocks-grid">
            {[
              {
                number: '01',
                title: 'Know Your Number',
                body: 'Get a clinically validated VO₂ max estimate — the single best predictor of cardiovascular health and all-cause mortality. Know exactly where you stand compared to your age and sex.',
                accent: 'var(--accent)',
              },
              {
                number: '02',
                title: 'A Plan to Improve It',
                body: 'Receive a personalized 8-week training protocol built from your results — with specific heart rate zones, session durations, and progression targets. Not generic advice.',
                accent: '#4A9EFF',
              },
              {
                number: '03',
                title: 'Track What Matters',
                body: 'Retest every 8–12 weeks and see your progress over time. Watch your score climb, your resting heart rate drop, and your classification improve.',
                accent: '#FFD166',
              },
            ].map((col) => (
              <div key={col.number} style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    color: col.accent,
                    display: 'block',
                    marginBottom: '14px',
                  }}
                >
                  {col.number}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '12px',
                  }}
                >
                  {col.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    color: 'var(--text2)',
                    lineHeight: 1.75,
                    maxWidth: '340px',
                    margin: '0 auto',
                  }}
                >
                  {col.body}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button
              onClick={onStart}
              className="landing-cta-btn uppercase cursor-pointer transition-all"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: 'var(--bg)',
                background: 'var(--accent)',
                padding: '15px 40px',
                borderRadius: '10px',
                border: 'none',
                boxShadow: 'var(--shadow-accent)',
              }}
            >
              Start Free Assessment →
            </button>
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                color: 'var(--text2)',
                marginTop: '12px',
              }}
            >
              Free · No Account · 10 Minutes
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="relative z-10 landing-footer"
        style={{
          borderTop: '1px solid var(--border)',
          padding: '20px 64px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <span
          className="uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            letterSpacing: '0.1em',
            color: 'var(--text3)',
          }}
        >
          Powered by Chester Step Test Protocol · K. Sykes, 1998
        </span>

        <ThemeToggle />
      </footer>

      {/* ── STICKY MOBILE CTA ── */}
      <div
        className={`landing-sticky-cta${showSticky ? ' landing-sticky-visible' : ''}`}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'var(--bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border)',
          padding: '12px 16px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <button
          onClick={onStart}
          className="uppercase cursor-pointer"
          style={{
            width: '100%',
            padding: '14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--bg)',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: '10px',
            boxShadow: '0 8px 28px rgba(20,230,180,0.3)',
          }}
        >
          Start Free VO₂ Max Test →
        </button>
      </div>

      {/* ── RESPONSIVE & ANIMATIONS ── */}
      <style>{`
        /* Hero layout */
        .landing-headline {
          font-size: 4rem;
          line-height: 1.1;
        }
        .landing-subheadline {
          font-size: 1.6rem;
          line-height: 1.4;
        }
        .landing-blurb {
          font-size: 1.05rem;
        }
        .landing-equip-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        /* Tablet */
        @media (max-width: 1023px) {
          .landing-headline { font-size: 3rem; }
          .landing-subheadline { font-size: 1.4rem; }
          .landing-blurb { font-size: 1rem; }
          .landing-hero-container { padding: 48px 24px 36px !important; }
          .landing-footer { padding: 20px 40px !important; }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .landing-headline { font-size: 2.2rem; line-height: 1.1; }
          .landing-subheadline { font-size: 1.15rem; }
          .landing-blurb { font-size: 0.95rem; }
          .landing-equip-grid {
            grid-template-columns: 1fr 1fr;
          }
          .landing-footer {
            padding: 20px 24px !important;
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* Audience grid */
        .landing-audience-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1023px) {
          .landing-audience-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .landing-audience-container {
            padding: 60px 40px !important;
          }
        }
        @media (max-width: 767px) {
          .landing-audience-grid {
            grid-template-columns: 1fr;
          }
          .landing-audience-container {
            padding: 48px 24px !important;
          }
          .landing-audience-card {
            padding: 20px !important;
          }
        }

        /* Unlocks grid */
        .landing-unlocks-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        @media (max-width: 1023px) {
          .landing-unlocks-container {
            padding: 60px 40px !important;
          }
        }
        @media (max-width: 767px) {
          .landing-unlocks-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .landing-unlocks-container {
            padding: 48px 24px !important;
          }
        }

        /* CTA hover */
        .landing-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 60px rgba(0,184,162,0.4), 0 8px 24px rgba(0,184,162,0.2);
        }
        .landing-cta-btn:active {
          transform: scale(0.98);
        }

        /* Staggered entrance */
        .landing-stagger-1,
        .landing-stagger-2,
        .landing-stagger-3,
        .landing-stagger-4,
        .landing-stagger-5,
        .landing-stagger-card {
          opacity: 0;
          animation: landingFadeUp 0.6s ease-out forwards;
        }
        .landing-stagger-1 { animation-delay: 0.1s; }
        .landing-stagger-2 { animation-delay: 0.2s; }
        .landing-stagger-3 { animation-delay: 0.3s; }
        .landing-stagger-4 { animation-delay: 0.4s; }
        .landing-stagger-5 { animation-delay: 0.5s; }
        .landing-stagger-card {
          animation-delay: 0.4s;
          animation-name: landingSlideRight;
        }

        @keyframes landingFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes landingSlideRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Sticky CTA */
        .landing-sticky-cta { display: none; }
        @media (max-width: 767px) {
          .landing-sticky-cta.landing-sticky-visible { display: flex; }
        }

        /* Mobile bottom padding for sticky CTA */
        @media (max-width: 767px) {
          .landing-footer { padding-bottom: 110px !important; }
        }
      `}</style>
    </div>
  );
}
