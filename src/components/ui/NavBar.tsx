import { useState, useCallback, useEffect } from 'react';

interface NavBarProps {
  onStart: () => void;
  onHowItWorks: () => void;
  onLogoClick?: () => void;
  startLabel?: string;
  subtleStart?: boolean;
  userName?: string | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

const SEGMENT_LINKS = [
  { label: 'Clinics', href: '/clinics' },
  { label: 'Facilities', href: '/facilities' },
  { label: 'Teams', href: '/teams' },
];

export default function NavBar({
  onStart,
  onHowItWorks,
  onLogoClick,
  startLabel,
  subtleStart,
  userName,
  onSignIn,
  onSignOut,
}: NavBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [betaModalOpen, setBetaModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onPopState = () => setDrawerOpen(false);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [drawerOpen]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen || betaModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen, betaModalOpen]);

  useEffect(() => {
    if (!betaModalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setBetaModalOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [betaModalOpen]);

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  const logo = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M3 12h4l3-9 4 18 3-9h4" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
        StepIQ
      </span>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setBetaModalOpen(true); }}
        className="mk-pill"
        style={{ fontSize: '0.68rem', padding: '4px 10px', border: 'none', cursor: 'pointer', letterSpacing: '0.08em' }}
        aria-label="About the beta"
      >
        BETA
      </button>
    </div>
  );

  const linkStyle = (active: boolean) => ({
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    fontWeight: 500,
    color: active ? 'var(--text)' : 'var(--text2)',
    textDecoration: 'none',
    padding: '8px 2px',
    borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
    transition: 'color 0.15s',
  });

  return (
    <>
      <nav
        className="site-nav"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: '72px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px',
          background: scrolled ? 'rgba(250, 248, 244, 0.86)' : 'rgba(250, 248, 244, 0.6)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
          transition: 'background 0.2s, border-color 0.2s',
        }}
      >
        <div style={{ cursor: 'pointer' }} onClick={onLogoClick}>{logo}</div>

        <div className="site-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {SEGMENT_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={linkStyle(currentPath.startsWith(l.href))}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={(e) => { if (!currentPath.startsWith(l.href)) e.currentTarget.style.color = 'var(--text2)'; }}
            >
              For {l.label}
            </a>
          ))}
          <span
            onClick={onHowItWorks}
            style={{ ...linkStyle(false), cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; }}
          >
            How it works
          </span>
        </div>

        <div className="site-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {userName ? (
            <>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text)' }}>{userName}</span>
              <button type="button" onClick={onSignOut} className="mk-btn mk-btn--ghost" style={{ padding: '8px 0', fontSize: '0.9rem' }}>Sign out</button>
            </>
          ) : onSignIn ? (
            <button type="button" onClick={onSignIn} style={{ ...linkStyle(false), background: 'none', border: 'none', cursor: 'pointer', borderBottom: 'none' }}>
              Sign in
            </button>
          ) : null}

          {subtleStart ? (
            <button type="button" onClick={onStart} className="mk-btn mk-btn--secondary" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
              {startLabel || 'Start new test'}
            </button>
          ) : (
            <button type="button" onClick={onStart} className="mk-btn mk-btn--primary" style={{ padding: '11px 22px', fontSize: '0.92rem', boxShadow: 'none' }}>
              {startLabel || 'Take the test'}
            </button>
          )}
        </div>

        <button
          className="site-nav-burger"
          onClick={() => setDrawerOpen((o) => !o)}
          aria-label="Menu"
          style={{ display: 'none', width: 44, height: 44, background: 'transparent', border: 'none', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
      </nav>

      {/* Drawer */}
      <div
        className="site-drawer-overlay"
        onClick={closeDrawer}
        style={{ position: 'fixed', inset: 0, background: 'rgba(27,31,28,0.35)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 99, opacity: drawerOpen ? 1 : 0, pointerEvents: drawerOpen ? 'auto' : 'none', transition: 'opacity 0.25s ease' }}
      />
      <div
        className="site-drawer"
        style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '82%', maxWidth: '360px', background: 'var(--surface)', borderLeft: '1px solid var(--border)', zIndex: 100, padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease', boxShadow: 'var(--shadow-lg)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => { closeDrawer(); onLogoClick?.(); }}>{logo}</div>
          <button onClick={closeDrawer} aria-label="Close menu" style={{ width: 40, height: 40, background: 'var(--surface2)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text3)', margin: '8px 0 6px' }}>For professionals</p>
          {SEGMENT_LINKS.map((l) => (
            <a key={l.href} href={l.href} style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text)', padding: '12px 0', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
              {l.label}
            </a>
          ))}
          <div onClick={() => { closeDrawer(); onHowItWorks(); }} style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text)', padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', marginTop: '12px' }}>
            How it works
          </div>
          {userName ? (
            <div onClick={() => { closeDrawer(); onSignOut?.(); }} style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text2)', padding: '16px 0', cursor: 'pointer' }}>
              Sign out ({userName})
            </div>
          ) : onSignIn ? (
            <div onClick={() => { closeDrawer(); onSignIn(); }} style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text2)', padding: '16px 0', cursor: 'pointer' }}>
              Sign in
            </div>
          ) : null}
        </div>

        <button type="button" onClick={() => { closeDrawer(); onStart(); }} className="mk-btn mk-btn--primary mk-btn--lg" style={{ width: '100%' }}>
          {startLabel || 'Take the free test'}
        </button>
      </div>

      {/* Beta modal */}
      {betaModalOpen && (
        <div onClick={() => setBetaModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(27,31,28,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div onClick={(e) => e.stopPropagation()} className="mk-card" style={{ position: 'relative', width: '100%', maxWidth: '440px', padding: '36px 32px', boxShadow: 'var(--shadow-lg)', borderRadius: '24px' }}>
            <button onClick={() => setBetaModalOpen(false)} aria-label="Close" style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: '50%', background: 'var(--surface2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <span className="mk-pill" style={{ marginBottom: '18px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 0 4px var(--accent-glow)' }} />
              Active beta
            </span>
            <h2 className="mk-display-md" style={{ marginBottom: '12px' }}>StepIQ is in active beta.</h2>
            <p className="mk-body" style={{ marginBottom: '14px' }}>
              I'm shaping the product based on what beta users tell me. If you take the test and have 30 seconds to share what worked, what didn't, or what surprised you — that's the most valuable thing you can give me.
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--text2)', marginBottom: '24px' }}>— Keith, founder</p>
            <a href="mailto:keith@stepiq.app?subject=StepIQ%20Beta%20Feedback" onClick={() => setBetaModalOpen(false)} className="mk-btn mk-btn--primary" style={{ width: '100%' }}>
              Send feedback
            </a>
          </div>
        </div>
      )}

      <style>{`
        :root[data-theme="dark"] .site-nav { background: rgba(15,14,19,0.82) !important; }
        @media (max-width: 1023px) {
          .site-nav { padding: 0 20px !important; height: 64px !important; }
          .site-nav-links, .site-nav-actions { display: none !important; }
          .site-nav-burger { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .site-drawer-overlay, .site-drawer { display: none !important; }
        }
      `}</style>
    </>
  );
}
