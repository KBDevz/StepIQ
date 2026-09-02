import { useState } from 'react';
import { SEGMENTS, type SegmentSlug } from '../../data/segments';
import NavBar from '../ui/NavBar';
import SiteFooter from '../ui/SiteFooter';
import Photo from '../ui/Photo';

interface SegmentPageProps {
  segment: SegmentSlug;
  onLogoClick: () => void;
  onHowItWorks: () => void;
  onStart: () => void;
  authNavProps?: { userName: string | null; onSignIn: () => void; onSignOut: () => void };
}

const Check = ({ color }: { color?: string }) => (
  <svg className="mk-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function SegmentPage({ segment, onLogoClick, onHowItWorks, onStart, authNavProps }: SegmentPageProps) {
  const c = SEGMENTS[segment];
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const demoHref = `mailto:hello@stepiq.app?subject=${encodeURIComponent(c.demoEmailSubject)}`;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <NavBar onStart={onStart} onHowItWorks={onHowItWorks} onLogoClick={onLogoClick} startLabel="Take the test" {...authNavProps} />

      <main style={{ paddingTop: '72px' }}>

        {/* ── HERO ── */}
        <section className="mk-section" style={{ paddingTop: '64px' }}>
          <div className="mk-container">
            <div className="mk-split mk-split--wide-media">
              <div>
                <p className="mk-eyebrow">{c.eyebrow}</p>
                <h1 className="mk-display-xl" style={{ marginBottom: '22px' }}>{c.headline}</h1>
                <p className="mk-lede" style={{ marginBottom: '32px', maxWidth: '540px' }}>{c.subhead}</p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
                  <a href={demoHref} className="mk-btn mk-btn--primary mk-btn--lg">Book a demo</a>
                  <a href="/report/demo" className="mk-btn mk-btn--secondary mk-btn--lg">See a sample report</a>
                </div>
                <p className="mk-small" style={{ maxWidth: '480px' }}>{c.socialProof}</p>
              </div>
              <Photo name={c.heroImage} alt={c.heroAlt} ratio="4 / 5" radius={28} priority hint={`Hero — ${c.navLabel.toLowerCase()}`} />
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="mk-section--tinted" style={{ padding: '48px 0' }}>
          <div className="mk-container">
            <div className="mk-grid-3">
              {c.stats.map((s) => (
                <div key={s.label}>
                  <p className="mk-stat">{s.value}</p>
                  <p className="mk-stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT YOU GET ── */}
        <section className="mk-section">
          <div className="mk-container">
            <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
              <p className="mk-eyebrow">What you get</p>
              <h2 className="mk-display-lg">Everything you need. <em>Nothing you don't.</em></h2>
            </div>
            <div className="mk-grid-3">
              {c.features.map((f) => (
                <div key={f.title} className="mk-card mk-card--flat">
                  <span style={{ display: 'inline-flex', width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <Check color="var(--accent)" />
                  </span>
                  <h3 className="mk-display-md" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{f.title}</h3>
                  <p className="mk-body">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="mk-section mk-section--tinted">
          <div className="mk-container">
            <div className="mk-split">
              <Photo name={c.supportImage} alt={c.supportAlt} ratio="4 / 5" radius={28} hint="Supporting photo" />
              <div>
                <p className="mk-eyebrow">How it works</p>
                <h2 className="mk-display-lg" style={{ marginBottom: '32px' }}>Three steps to get started.</h2>
                <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  {c.steps.map((s) => (
                    <li key={s.number} style={{ display: 'flex', gap: '20px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', lineHeight: 1, color: 'var(--clay)', minWidth: '44px' }}>{s.number}</span>
                      <div>
                        <h3 className="mk-display-md" style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{s.title}</h3>
                        <p className="mk-body">{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT IT REPLACES (ink) ── */}
        <section className="mk-section mk-section--ink">
          <div className="mk-container">
            <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
              <p className="mk-eyebrow">The alternatives</p>
              <h2 className="mk-display-lg" style={{ color: '#F4F7F5' }}>A fraction of the cost. None of the friction.</h2>
            </div>
            <div className="mk-grid-3">
              {c.replaces.map((r) => (
                <div key={r.label} className="mk-card" style={{ background: r.highlight ? '#FFFFFF' : 'rgba(255,255,255,0.06)', borderColor: r.highlight ? 'transparent' : 'rgba(255,255,255,0.12)', boxShadow: r.highlight ? 'var(--shadow-lg)' : 'none' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: r.highlight ? 'var(--accent)' : 'rgba(244,247,245,0.6)', marginBottom: '12px' }}>{r.label}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', lineHeight: 1.05, letterSpacing: '-0.01em', color: r.highlight ? 'var(--text)' : '#F4F7F5', marginBottom: '12px' }}>{r.cost}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.55, color: r.highlight ? 'var(--text2)' : 'rgba(244,247,245,0.72)' }}>{r.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="mk-section">
          <div className="mk-narrow">
            <div className="mk-card" style={{ padding: '44px 40px', borderRadius: '28px', borderColor: 'var(--accent)', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
              <p className="mk-eyebrow">Pricing</p>
              <h2 className="mk-display-lg" style={{ marginBottom: '14px' }}>{c.pricingHeadline}</h2>
              <p className="mk-body" style={{ marginBottom: '28px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>{c.pricingBody}</p>
              <a href={demoHref} className="mk-btn mk-btn--primary">Talk to us</a>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mk-section mk-section--tinted">
          <div className="mk-narrow">
            <p className="mk-eyebrow">Common questions</p>
            <h2 className="mk-display-lg" style={{ marginBottom: '32px' }}>Answers, up front.</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {c.faq.map((item, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className="mk-card mk-card--flat" style={{ padding: 0, overflow: 'hidden' }}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      style={{ width: '100%', padding: '20px 24px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', textAlign: 'left' }}
                    >
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)' }}>{item.q}</span>
                      <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', fontSize: '1.1rem', lineHeight: 1 }}>+</span>
                    </button>
                    {open && <p className="mk-body" style={{ padding: '0 24px 22px' }}>{item.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="mk-section">
          <div className="mk-narrow" style={{ textAlign: 'center' }}>
            <h2 className="mk-display-lg" style={{ marginBottom: '16px' }}>Ready to see it <em>in action?</em></h2>
            <p className="mk-lede" style={{ marginBottom: '32px' }}>A fifteen-minute walkthrough with your setting in mind. No commitment.</p>
            <a href={demoHref} className="mk-btn mk-btn--primary mk-btn--lg">Book a demo</a>
          </div>
        </section>
      </main>

      <SiteFooter onStart={onStart} onHowItWorks={onHowItWorks} />
    </div>
  );
}
