import { useState } from 'react';
import { SEGMENTS, type SegmentSlug } from '../../data/segments';
import NavBar from '../ui/NavBar';

interface SegmentPageProps {
  segment: SegmentSlug;
  onLogoClick: () => void;
  onHowItWorks: () => void;
  onStart: () => void;
  authNavProps?: { userName: string | null; onSignIn: () => void; onSignOut: () => void };
}

export default function SegmentPage({ segment, onLogoClick, onHowItWorks, onStart, authNavProps }: SegmentPageProps) {
  const config = SEGMENTS[segment];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const demoHref = `mailto:hello@stepiq.app?subject=${encodeURIComponent(config.demoEmailSubject)}`;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <NavBar
        onStart={onStart}
        onHowItWorks={onHowItWorks}
        onLogoClick={onLogoClick}
        startLabel="Take the Test"
        {...authNavProps}
      />

      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(28,47,74,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(28,47,74,0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div style={{ position: 'relative', zIndex: 1, paddingTop: '96px' }}>

        {/* Hero */}
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px 48px', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'var(--accent)',
            marginBottom: '20px',
          }}>
            {config.eyebrow}
          </p>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 6vw, 3.4rem)',
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            marginBottom: '20px',
          }}>
            {config.headline}
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'var(--text2)',
            lineHeight: 1.55,
            maxWidth: '640px',
            margin: '0 auto 32px',
          }}>
            {config.subhead}
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={demoHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 28px',
                background: 'var(--accent)',
                color: '#062018',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: '0 8px 28px rgba(20,230,180,0.3)',
              }}
            >
              Book a Demo →
            </a>
            <a
              href="/report/demo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 28px',
                background: 'transparent',
                color: 'var(--text)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                borderRadius: '12px',
                textDecoration: 'none',
                border: '1px solid var(--border)',
              }}
            >
              See Sample Report
            </a>
          </div>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text3)',
            marginTop: '28px',
            letterSpacing: '0.06em',
            fontStyle: 'italic',
          }}>
            {config.socialProof}
          </p>
        </section>

        {/* Divider */}
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Features */}
        <section style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'var(--text3)',
            marginBottom: '12px',
            textAlign: 'center',
          }}>
            What You Get
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 700,
            color: 'var(--text)',
            textAlign: 'center',
            marginBottom: '40px',
            lineHeight: 1.2,
          }}>
            Everything you need. Nothing you don't.
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}>
            {config.features.map((f) => (
              <div key={f.title} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '24px',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: '10px',
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: 'var(--text2)',
                  lineHeight: 1.55,
                }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px 64px' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'var(--text3)',
            marginBottom: '12px',
            textAlign: 'center',
          }}>
            How It Works
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 700,
            color: 'var(--text)',
            textAlign: 'center',
            marginBottom: '40px',
            lineHeight: 1.2,
          }}>
            Three steps to get started.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {config.steps.map((s) => (
              <div key={s.number} style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                padding: '24px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  lineHeight: 1,
                  minWidth: '48px',
                }}>
                  {s.number}
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '6px',
                  }}>
                    {s.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    color: 'var(--text2)',
                    lineHeight: 1.55,
                  }}>
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 24px 64px' }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--accent)',
            borderRadius: '18px',
            padding: '36px 28px',
            textAlign: 'center',
            boxShadow: '0 4px 30px rgba(20,230,180,0.15)',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'var(--accent)',
              marginBottom: '12px',
            }}>
              Pricing
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 5vw, 2.4rem)',
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.15,
              marginBottom: '14px',
            }}>
              {config.pricingHeadline}
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--text2)',
              lineHeight: 1.55,
              marginBottom: '24px',
            }}>
              {config.pricingBody}
            </p>
            <a
              href={demoHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 24px',
                background: 'var(--accent)',
                color: '#062018',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                borderRadius: '10px',
                textDecoration: 'none',
              }}
            >
              Talk to Sales →
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px 64px' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'var(--text3)',
            marginBottom: '12px',
            textAlign: 'center',
          }}>
            Common Questions
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 700,
            color: 'var(--text)',
            textAlign: 'center',
            marginBottom: '32px',
            lineHeight: 1.2,
          }}>
            Answers, upfront.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {config.faq.map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    color: 'var(--text)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                  }}
                >
                  <span>{item.q}</span>
                  <span style={{
                    color: 'var(--accent)',
                    fontSize: '1.2rem',
                    transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    marginLeft: '16px',
                  }}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{
                    padding: '0 20px 20px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'var(--text2)',
                    lineHeight: 1.6,
                  }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px 96px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '16px',
            lineHeight: 1.2,
          }}>
            Ready to see it in action?
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--text2)',
            marginBottom: '28px',
            lineHeight: 1.55,
          }}>
            15-minute demo. No commitment. We'll walk you through the flow with your use case in mind.
          </p>
          <a
            href={demoHref}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '18px 32px',
              background: 'var(--accent)',
              color: '#062018',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              borderRadius: '12px',
              textDecoration: 'none',
              boxShadow: '0 8px 28px rgba(20,230,180,0.3)',
            }}
          >
            Book a Demo →
          </a>
        </section>
      </div>
    </div>
  );
}
