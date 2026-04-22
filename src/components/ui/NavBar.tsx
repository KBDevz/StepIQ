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

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onPopState = () => setDrawerOpen(false);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [drawerOpen]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const logo = (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'var(--accent-dark)',
          border: '1px solid rgba(0,184,162,0.3)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12h4l3-9 4 18 3-9h4"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text)', fontWeight: 700, letterSpacing: '-0.01em' }}>
        StepIQ
      </span>
    </div>
  );

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between hiw-nav-pad"
        style={{
          height: '64px',
          background: 'rgba(15,14,19,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Logo */}
        <div className="cursor-pointer" onClick={onLogoClick}>
          {logo}
        </div>

        {/* Desktop nav items */}
        <div className="nav-desktop-items flex items-center" style={{ gap: '28px' }}>
          <span
            onClick={onHowItWorks}
            className="cursor-pointer transition-colors"
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 400, color: 'var(--text2)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; }}
          >
            How It Works
          </span>

          {userName ? (
            <div className="flex items-center gap-4">
              <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontFamily: 'var(--font-body)' }}>
                {userName}
              </span>
              <span
                onClick={onSignOut}
                className="cursor-pointer transition-colors font-mono uppercase"
                style={{ fontSize: '0.65rem', color: 'var(--text2)', letterSpacing: '0.06em' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; }}
              >
                Sign Out
              </span>
            </div>
          ) : onSignIn ? (
            <span
              onClick={onSignIn}
              className="cursor-pointer transition-colors"
              style={{ fontSize: '0.85rem', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; }}
            >
              Sign In
            </span>
          ) : null}

          {subtleStart ? (
            <span
              onClick={onStart}
              className="cursor-pointer transition-colors font-mono uppercase"
              style={{ fontSize: '0.65rem', color: 'var(--text2)', letterSpacing: '0.06em' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; }}
            >
              {startLabel || 'Start New Test'}
            </span>
          ) : (
            <button
              onClick={onStart}
              className="cursor-pointer transition-all font-mono uppercase"
              style={{
                fontSize: '0.72rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                color: 'var(--text2)',
                border: '1px solid var(--border)',
                background: 'var(--surface2)',
                padding: '8px 18px',
                borderRadius: '10px',
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
              {startLabel || 'Start Assessment'}
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setDrawerOpen((o) => !o)}
          aria-label="Menu"
          style={{
            display: 'none',
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5px',
            padding: '8px',
            cursor: 'pointer',
          }}
        >
          <span className="nav-burger-line nav-burger-top" style={{
            width: '22px', height: '2px', background: 'var(--text)',
            borderRadius: '2px', transition: 'all 0.25s ease', display: 'block',
          }} />
          <span className="nav-burger-line nav-burger-mid" style={{
            width: '22px', height: '2px', background: 'var(--text)',
            borderRadius: '2px', transition: 'all 0.25s ease', display: 'block',
          }} />
          <span className="nav-burger-line nav-burger-bot" style={{
            width: '22px', height: '2px', background: 'var(--text)',
            borderRadius: '2px', transition: 'all 0.25s ease', display: 'block',
          }} />
        </button>
      </nav>

      {/* Mobile drawer overlay */}
      <div
        className="nav-drawer-overlay"
        onClick={closeDrawer}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 99,
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Mobile drawer */}
      <div
        className="nav-drawer"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '75%',
          maxWidth: '300px',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          zIndex: 100,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
          <div className="cursor-pointer" onClick={() => { closeDrawer(); onLogoClick?.(); }}>
            {logo}
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close menu"
            style={{
              width: '36px',
              height: '36px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer menu items */}
        <div style={{ flex: 1 }}>
          <div
            onClick={() => { closeDrawer(); onHowItWorks(); }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.3rem',
              color: 'var(--text)',
              padding: '16px 0',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer',
            }}
          >
            How It Works
          </div>

          {userName ? (
            <>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  color: 'var(--text2)',
                  padding: '16px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {userName}
              </div>
              <div
                onClick={() => { closeDrawer(); onSignOut?.(); }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  color: 'var(--text)',
                  padding: '16px 0',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </div>
            </>
          ) : onSignIn ? (
            <div
              onClick={() => { closeDrawer(); onSignIn(); }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                color: 'var(--text)',
                padding: '16px 0',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
              }}
            >
              Sign In
            </div>
          ) : null}
        </div>

        {/* Bottom CTA */}
        <button
          onClick={() => { closeDrawer(); onStart(); }}
          className="font-mono uppercase cursor-pointer"
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: 'var(--bg)',
            background: 'var(--accent)',
            padding: '15px 24px',
            borderRadius: '10px',
            border: 'none',
            boxShadow: 'var(--shadow-accent)',
            width: '100%',
            marginTop: 'auto',
          }}
        >
          Start Free Assessment →
        </button>
      </div>

      <style>{`
        .hiw-nav-pad { padding: 0 64px; }
        @media (max-width: 767px) {
          .hiw-nav-pad { padding: 0 16px !important; }
          .nav-desktop-items { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .hiw-nav-pad { padding: 0 40px !important; }
        }
        @media (min-width: 768px) {
          .nav-drawer-overlay,
          .nav-drawer { display: none !important; }
        }
      `}</style>
    </>
  );
}
