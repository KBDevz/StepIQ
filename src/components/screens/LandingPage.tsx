import { useState, useEffect } from 'react';
import NavBar from '../ui/NavBar';
import ThemeToggle from '../ui/ThemeToggle';

interface LandingPageProps {
  onStart: () => void;
  onHowItWorks: () => void;
  authNavProps?: { userName: string | null; onSignIn: () => void; onSignOut: () => void };
}

const pills = ['Free · No Signup', 'Clinically Validated', 'Personalized Insights'];

/* ─────────────────────────────────────────────
   Main Landing Page
   ───────────────────────────────────────────── */
export default function LandingPage({ onStart, onHowItWorks, authNavProps }: LandingPageProps) {
  const [showSticky, setShowSticky] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const distFromBottom = document.body.scrollHeight - window.scrollY - window.innerHeight;
      setShowSticky(distFromBottom >= 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        className="relative z-10"
        style={{
          minHeight: 'calc(100vh - 64px)',
          marginTop: '64px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="landing-container"
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 64px',
          }}
        >
          <div className="landing-grid">
            {/* ── LEFT COLUMN ── */}
            <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
              {/* Eyebrow */}
              <p
                className="uppercase landing-stagger-1"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.18em',
                  color: 'var(--accent)',
                  marginBottom: '24px',
                }}
              >
                At-Home VO₂ Max Assessment
              </p>

              {/* Headline */}
              <h1
                className="landing-stagger-2 landing-headline"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--text)',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  marginBottom: '12px',
                }}
              >
                VO₂ max is the #1 predictor of how long you'll live.
              </h1>

              {/* Sub-headline */}
              <p
                className="landing-stagger-2 landing-subheadline"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--accent)',
                  letterSpacing: '-0.01em',
                  marginBottom: '28px',
                }}
              >
                This is the easiest way to measure yours.
              </p>

              {/* Description */}
              <p
                className="landing-stagger-3 landing-desktop-only"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  color: 'var(--text2)',
                  lineHeight: 1.75,
                  maxWidth: '520px',
                  marginBottom: '28px',
                }}
              >
                StepIQ is a free, clinically validated 10-minute step test.
                Get your VO₂ max score, see how you compare, and receive
                a personalized plan to improve it. No lab visit. No signup.
              </p>

              {/* Trust badges */}
              <div
                className="flex flex-wrap landing-stagger-4"
                style={{ gap: '8px', marginBottom: '20px' }}
              >
                {pills.map((pill) => (
                  <span
                    key={pill}
                    className="uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.1em',
                      color: 'var(--accent)',
                      background: 'var(--accent-dark)',
                      border: '1px solid rgba(0,184,162,0.25)',
                      padding: '5px 12px',
                      borderRadius: '20px',
                    }}
                  >
                    ✓ {pill}
                  </span>
                ))}
              </div>

              {/* What You Need strip */}
              <div
                className="landing-stagger-4 landing-need-strip"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '14px 24px',
                  marginBottom: '32px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  maxWidth: '100%',
                  gap: '8px',
                }}
              >
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>10 Minutes</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--text2)' }}>to complete</span>
                </div>
                <div className="landing-need-divider" style={{ width: '1px', height: '28px', background: 'var(--border)', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>HR Monitor</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--text2)' }}>watch or strap</span>
                </div>
                <div className="landing-need-divider" style={{ width: '1px', height: '28px', background: 'var(--border)', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>12&quot; Step</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--text2)', fontStyle: 'italic' }}>or measure your stairs</span>
                </div>
                <div className="landing-need-divider" style={{ width: '1px', height: '28px', background: 'var(--border)', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>Your Phone</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--text2)' }}>any browser</span>
                </div>
              </div>

              {/* CTA */}
              <div className="landing-stagger-5">
                <div className="landing-cta-row">
                  <button
                    onClick={onStart}
                    className="landing-cta-btn uppercase cursor-pointer transition-all"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      flex: '0 0 60%',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      color: 'var(--bg)',
                      background: 'var(--accent)',
                      padding: '15px 24px',
                      borderRadius: '10px',
                      border: 'none',
                      boxShadow: 'var(--shadow-accent)',
                    }}
                  >
                    Start Free Assessment →
                  </button>
                  <button
                    onClick={onHowItWorks}
                    className="landing-learn-btn uppercase cursor-pointer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      flex: '0 0 38%',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      color: 'var(--text2)',
                      background: 'transparent',
                      padding: '15px 24px',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--text)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text2)';
                    }}
                  >
                    Learn More
                  </button>
                </div>
                <p
                  className="uppercase"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.12em',
                    color: 'var(--text2)',
                    marginTop: '12px',
                    textAlign: 'center',
                  }}
                >
                  Free · No Account · 10 Minutes
                </p>
                <span
                  onClick={() => {
                    document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    color: 'var(--accent)',
                    textAlign: 'center',
                    display: 'block',
                    marginTop: '14px',
                    cursor: 'pointer',
                  }}
                >
                  See how it works ↓
                </span>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="landing-right-col landing-stagger-card">
              <img
                src="/hero-phones.png"
                alt="StepIQ app showing VO₂ max results on two phones"
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </div>
          </div>
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
          zIndex: 50,
          background: 'var(--bg)',
          borderTop: '1px solid var(--border)',
          padding: '12px 24px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <button
          onClick={onStart}
          className="uppercase cursor-pointer"
          style={{
            width: '100%',
            height: '52px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--bg)',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-accent)',
          }}
        >
          Start Free VO₂ Max Test →
        </button>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'var(--text2)',
          textAlign: 'center',
          marginTop: '6px',
        }}>
          100% free · No signup · 10 minutes
        </p>
      </div>

      {/* ── RESPONSIVE & ANIMATIONS ── */}
      <style>{`
        /* Desktop grid */
        .landing-grid {
          display: grid;
          grid-template-columns: 55% 45%;
          gap: 80px;
          align-items: center;
          width: 100%;
        }
        .landing-headline {
          font-size: 4rem;
          line-height: 1.05;
        }
        .landing-subheadline {
          font-size: 1.6rem;
          line-height: 1.3;
        }
        .landing-right-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Tablet */
        @media (max-width: 1023px) {
          .landing-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            max-width: 600px;
            margin: 0 auto;
          }
          .landing-headline { font-size: 3rem; line-height: 1.1; }
          .landing-subheadline { font-size: 1.4rem; }
          .landing-container { padding: 0 40px !important; }

          .landing-footer { padding: 20px 40px !important; }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .landing-headline { font-size: 2rem; line-height: 1.15; }
          .landing-subheadline { font-size: 1.15rem; }
          .landing-container { padding: 0 24px !important; }
          .landing-right-col { display: none; }
          .landing-footer {
            padding: 20px 24px !important;
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* Large screens */
        @media (min-width: 1400px) {
          .landing-headline { font-size: 4rem; }
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

        /* CTA button row */
        .landing-cta-row {
          display: flex;
          gap: 12px;
          width: 100%;
        }
        @media (max-width: 767px) {
          .landing-cta-row {
            flex-direction: column;
            gap: 10px;
          }
          .landing-cta-row button {
            flex: 1 1 auto !important;
            width: 100% !important;
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

        /* Mobile/Desktop visibility */
        .landing-mobile-only { display: none; }
        .landing-desktop-only { display: block; }
        .landing-sticky-cta { display: none; }

        @media (max-width: 767px) {
          .landing-mobile-only { display: block !important; }
          .landing-desktop-only { display: none !important; }
          .landing-mobile-only.flex { display: flex !important; }
          .landing-sticky-cta.landing-sticky-visible { display: flex; }
        }

        /* Need strip mobile */
        @media (max-width: 480px) {
          .landing-need-strip {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 12px !important;
            padding: 16px !important;
          }
          .landing-need-divider {
            display: none !important;
          }
        }

        /* Mobile bottom padding for sticky CTA */
        @media (max-width: 767px) {
          .landing-footer { padding-bottom: 110px !important; }
        }
      `}</style>
    </div>
  );
}
