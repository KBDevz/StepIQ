import { useState, useEffect, useRef, useCallback } from 'react';
import NavBar from '../ui/NavBar';
import SiteFooter from '../ui/SiteFooter';
import Photo from '../ui/Photo';

interface LandingPageProps {
  onStart: () => void;
  onHowItWorks: () => void;
  authNavProps?: { userName: string | null; onSignIn: () => void; onSignOut: () => void };
}

const Check = () => (
  <svg className="mk-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/* Small product peek: the regression chart from a sample result */
function SampleResultCard() {
  return (
    <div className="mk-card" style={{ padding: '20px 22px', borderRadius: '18px', boxShadow: 'var(--shadow-lg)', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span className="mk-small" style={{ fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.7rem' }}>Your VO₂ max</span>
        <span className="mk-pill" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>Good</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', lineHeight: 1, color: 'var(--accent)', letterSpacing: '-0.02em' }}>41.2</span>
        <span className="mk-small">ml · kg⁻¹ · min⁻¹</span>
      </div>
      <svg width="100%" height="64" viewBox="0 0 320 90" preserveAspectRatio="none" style={{ display: 'block' }}>
        <line x1="0" y1="30" x2="320" y2="30" stroke="var(--border)" strokeWidth="1" />
        <line x1="0" y1="60" x2="320" y2="60" stroke="var(--border)" strokeWidth="1" />
        <defs><linearGradient id="lpArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" /><stop offset="100%" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
        <path d="M20 72 L90 58 L160 46 L230 34 L230 90 L20 90 Z" fill="url(#lpArea)" />
        <polyline points="20,72 90,58 160,46 230,34" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="230" y1="34" x2="300" y2="18" stroke="var(--clay)" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
        {[[20,72],[90,58],[160,46],[230,34]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="4" fill="var(--accent)" />)}
        <circle cx="300" cy="18" r="7" fill="var(--clay)" opacity="0.25" /><circle cx="300" cy="18" r="4" fill="var(--clay)" />
      </svg>
      <p className="mk-small" style={{ marginTop: '6px', fontSize: '0.72rem' }}>Sample · 4 of 5 levels · age 35</p>
    </div>
  );
}

export default function LandingPage({ onStart, onHowItWorks, authNavProps }: LandingPageProps) {
  const [showSticky, setShowSticky] = useState(false);
  const heroCTARef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!heroCTARef.current) return;
    const pastHero = heroCTARef.current.getBoundingClientRect().bottom < 0;
    const finalCTA = document.querySelector('[data-final-cta]');
    let nearFinal = false;
    if (finalCTA) nearFinal = Math.abs(finalCTA.getBoundingClientRect().top - window.innerHeight) < 200;
    const distFromBottom = document.body.scrollHeight - window.scrollY - window.innerHeight;
    setShowSticky(pastHero && !nearFinal && distFromBottom > 200);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <NavBar onStart={onStart} onHowItWorks={onHowItWorks} {...authNavProps} />

      <main style={{ paddingTop: '72px' }}>

        {/* ── HERO ── */}
        <section className="mk-section" style={{ paddingTop: '64px' }}>
          <div className="mk-container">
            <div className="mk-split mk-split--wide-media lp-hero">
              <div>
                <p className="mk-eyebrow">Clinical-grade VO₂ max · at home</p>
                <h1 className="mk-display-xl" style={{ marginBottom: '22px' }}>
                  The one fitness number that predicts <em>how long you'll live.</em>
                </h1>
                <p className="mk-lede" style={{ marginBottom: '32px', maxWidth: '520px' }}>
                  StepIQ turns a clinically validated step test into a ten-minute VO₂ max assessment you can do in your living room — accurate to within 8–10% of a laboratory test. Then it tells you exactly what to do about it.
                </p>
                <div ref={heroCTARef} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
                  <button type="button" onClick={onStart} className="mk-btn mk-btn--primary mk-btn--lg">Take the free test</button>
                  <button type="button" onClick={onHowItWorks} className="mk-btn mk-btn--secondary mk-btn--lg">See how it works</button>
                </div>
                <p className="mk-small">No account · No credit card · Ten minutes</p>
              </div>

              <div style={{ position: 'relative' }}>
                <Photo name="hero-home.jpg" alt="Woman stepping onto a low oak step in a bright living room" ratio="4 / 5" radius={28} priority hint="Hero photo — person mid step-test, warm daylight" />
                <div className="lp-hero-card" style={{ position: 'absolute', left: '-28px', bottom: '36px', width: 'min(300px, 80%)' }}>
                  <SampleResultCard />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST STRIP ── */}
        <section className="mk-section--tinted" style={{ padding: '48px 0' }}>
          <div className="mk-container">
            <div className="mk-grid-4">
              {[
                { v: '0.92', l: 'Correlation with lab VO₂ testing (r)' },
                { v: '±8%', l: 'Typical accuracy vs. a metabolic cart' },
                { v: '10 min', l: 'Start to score, including setup' },
                { v: '1998', l: 'Protocol in clinical use since' },
              ].map((s) => (
                <div key={s.l}>
                  <p className="mk-stat">{s.v}</p>
                  <p className="mk-stat-label">{s.l}</p>
                </div>
              ))}
            </div>
            <p className="mk-small" style={{ marginTop: '32px' }}>
              Chester Step Test · Sykes &amp; Roberts, <em>Occupational Medicine</em> 2004 · Research cited in JAMA and Mayo Clinic Proceedings
            </p>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="mk-section" id="how-it-works-section">
          <div className="mk-container">
            <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
              <p className="mk-eyebrow">How it works</p>
              <h2 className="mk-display-lg">Ten minutes. A step. A heart-rate monitor.</h2>
            </div>
            <div className="mk-grid-3">
              <div>
                <Photo name="detail-hr.jpg" alt="Heart-rate strap and watch beside an exercise step" ratio="4 / 3" radius={20} hint="Detail — HR strap + step" />
                <p className="mk-eyebrow" style={{ marginTop: '22px', marginBottom: '8px' }}>01 · Set up</p>
                <h3 className="mk-display-md" style={{ marginBottom: '8px' }}>Grab a step and a monitor</h3>
                <p className="mk-body">Any 15–30 cm step works — stairs included. A chest strap or watch gives us your heart rate. Enter your age and sex. Thirty seconds.</p>
              </div>
              <div>
                <Photo name="hero-home.jpg" alt="Stepping to a guided cadence" ratio="4 / 3" radius={20} hint="Action — stepping to the beat" />
                <p className="mk-eyebrow" style={{ marginTop: '22px', marginBottom: '8px' }}>02 · Step</p>
                <h3 className="mk-display-md" style={{ marginBottom: '8px' }}>Follow the beat</h3>
                <p className="mk-body">Up to five two-minute levels, each a little faster, with a metronome and on-screen cues. Most people finish three or four. You never go to exhaustion.</p>
              </div>
              <div>
                <div style={{ aspectRatio: '4 / 3', borderRadius: 20, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                  <div style={{ width: '100%', maxWidth: '300px' }}><SampleResultCard /></div>
                </div>
                <p className="mk-eyebrow" style={{ marginTop: '22px', marginBottom: '8px' }}>03 · Understand</p>
                <h3 className="mk-display-md" style={{ marginBottom: '8px' }}>Get your score and a plan</h3>
                <p className="mk-body">We fit a line through your heart-rate data and project to your maximum — the same method physiologists use. You get your VO₂ max, your percentile, and an eight-week protocol.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY IT MATTERS ── */}
        <section className="mk-section mk-section--tinted">
          <div className="mk-container">
            <div className="mk-split">
              <Photo name="portrait-man.jpg" alt="Man in his fifties resting after a workout in a sunlit room" ratio="4 / 5" radius={28} hint="Portrait — post-workout, warm light" />
              <div>
                <p className="mk-eyebrow">Why VO₂ max</p>
                <h2 className="mk-display-lg" style={{ marginBottom: '20px' }}>Your heart's engine size, <em>in one number.</em></h2>
                <p className="mk-body" style={{ marginBottom: '16px' }}>
                  VO₂ max is how much oxygen your body can use at full effort. In a 2018 JAMA study of 122,000 patients, it outperformed smoking, diabetes and high blood pressure as a predictor of all-cause mortality — and there was no upper limit to the benefit.
                </p>
                <p className="mk-body" style={{ marginBottom: '24px' }}>
                  It also moves. With the right training, most people see measurable gains inside eight weeks.
                </p>
                <ul className="mk-list">
                  <li><Check /><span><strong>Measured, not guessed.</strong> Your watch estimates VO₂ from passive movement. StepIQ measures it from a controlled, graded effort.</span></li>
                  <li><Check /><span><strong>Safe by design.</strong> The protocol is submaximal — you stop at a comfortable effort and we project the rest.</span></li>
                  <li><Check /><span><strong>Actionable.</strong> Every score comes with heart-rate zones and a plan calibrated to where you are today.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ── */}
        <section className="mk-section">
          <div className="mk-container">
            <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
              <p className="mk-eyebrow">Who it's for</p>
              <h2 className="mk-display-lg">Built for anyone who takes their health seriously.</h2>
            </div>
            <div className="mk-grid-4">
              {[
                { t: 'The optimizer', b: 'You already track sleep and steps. You want a rigorous VO₂ number your wearable can\'t give you — and a way to move it.' },
                { t: 'The baseline seeker', b: 'You want to know exactly where your cardiovascular fitness stands, without booking a lab.' },
                { t: 'The comeback', b: 'You\'re returning after illness, injury or a long break and need a safe, validated starting point.' },
                { t: 'The professional', b: 'Your role requires cardiovascular screening. StepIQ follows the same protocol used in occupational health.' },
              ].map((c) => (
                <div key={c.t} className="mk-card mk-card--flat">
                  <h3 className="mk-display-md" style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{c.t}</h3>
                  <p className="mk-body">{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOR PROFESSIONALS (ink band) ── */}
        <section className="mk-section mk-section--ink">
          <div className="mk-container">
            <div style={{ maxWidth: '680px', marginBottom: '48px' }}>
              <p className="mk-eyebrow">StepIQ for professionals</p>
              <h2 className="mk-display-lg" style={{ color: '#F4F7F5' }}>Built for clinics, gyms, and whole departments.</h2>
              <p className="mk-lede" style={{ marginTop: '16px' }}>The same protocol, deployed at scale — with rosters, branded reports, and the compliance tooling each setting needs.</p>
            </div>
            <div className="mk-grid-3">
              {[
                { href: '/clinics', l: 'For clinics', t: 'Clinical-grade VO₂ assessment without a metabolic cart.', b: ['Multi-patient roster', 'HIPAA-ready hosting', 'Branded PDF reports'] },
                { href: '/facilities', l: 'For facilities', t: 'Turn a corner of your gym into a testing station.', b: ['Assisted-mode testing', 'Cohort challenges', 'Training upsell surface'] },
                { href: '/teams', l: 'For teams', t: 'Annual VO₂ compliance for your whole roster.', b: ['NFPA 1582 pass/fail', 'Batch reporting', 'On-site testing'] },
              ].map((c) => (
                <a key={c.href} href={c.href} className="mk-card lp-pro-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', background: '#FFFFFF', borderColor: 'transparent' }}>
                  <p className="mk-eyebrow" style={{ marginBottom: '10px' }}>{c.l}</p>
                  <h3 className="mk-display-md" style={{ fontSize: '1.35rem', marginBottom: '16px' }}>{c.t}</h3>
                  <ul className="mk-list" style={{ gap: '8px', marginBottom: '22px' }}>
                    {c.b.map((x) => <li key={x} style={{ fontSize: '0.95rem' }}><Check />{x}</li>)}
                  </ul>
                  <span style={{ marginTop: 'auto', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--accent)' }}>Learn more →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT YOU GET ── */}
        <section className="mk-section">
          <div className="mk-container">
            <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
              <p className="mk-eyebrow">What your score unlocks</p>
              <h2 className="mk-display-lg">One test. Three outcomes.</h2>
            </div>
            <div className="mk-grid-3">
              {[
                { n: '01', t: 'Know your number', b: 'A validated VO₂ max estimate, your percentile against people your age and sex, and a fitness age you\'ll actually remember.' },
                { n: '02', t: 'A plan to improve it', b: 'An eight-week protocol built from your result — heart-rate zones, session lengths, and a target for your next test.' },
                { n: '03', t: 'Track what matters', b: 'Retest every eight to twelve weeks and watch the trend. Your score climbs, your resting heart rate falls.' },
              ].map((c) => (
                <div key={c.n}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--clay)', lineHeight: 1, marginBottom: '14px' }}>{c.n}</p>
                  <h3 className="mk-display-md" style={{ marginBottom: '10px' }}>{c.t}</h3>
                  <p className="mk-body">{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="mk-section mk-section--tinted">
          <div className="mk-narrow" style={{ textAlign: 'center' }}>
            <h2 className="mk-display-lg" style={{ marginBottom: '16px' }}>Ten minutes. One number. <em>A plan.</em></h2>
            <p className="mk-lede" style={{ marginBottom: '32px' }}>Find out where you stand today.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" data-final-cta onClick={onStart} className="mk-btn mk-btn--primary mk-btn--lg">Take the free test</button>
              <a href="/report/demo" className="mk-btn mk-btn--secondary mk-btn--lg">See a sample report</a>
            </div>
            <p className="mk-small" style={{ marginTop: '18px' }}>Free · No account · Works on any phone</p>
          </div>
        </section>
      </main>

      <SiteFooter onStart={onStart} onHowItWorks={onHowItWorks} />

      {/* Sticky mobile CTA */}
      <div className={`lp-sticky${showSticky ? ' lp-sticky--on' : ''}`} style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, background: 'rgba(250,248,244,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid var(--border)', padding: '12px 16px', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <button type="button" onClick={onStart} className="mk-btn mk-btn--primary" style={{ width: '100%' }}>Take the free test</button>
      </div>

      <style>{`
        .lp-pro-card { transition: transform 0.18s, box-shadow 0.18s; }
        .lp-pro-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
        .lp-sticky { display: none; }
        @media (max-width: 767px) {
          .lp-sticky--on { display: block; }
          .lp-hero-card { position: static !important; width: 100% !important; margin-top: 16px; }
        }
        @media (max-width: 1023px) {
          .lp-hero-card { left: 16px !important; bottom: 16px !important; }
        }
      `}</style>
    </div>
  );
}
