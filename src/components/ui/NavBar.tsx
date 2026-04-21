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
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onLogoClick}
        >
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

        <div className="flex items-center" style={{ gap: '28px' }}>
          <span
            onClick={onHowItWorks}
            className="hidden sm:inline cursor-pointer transition-colors"
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 400, color: 'var(--text2)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; }}
          >
            How it works
          </span>

          {/* Auth section */}
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
      </nav>

      <style>{`
        .hiw-nav-pad { padding: 0 64px; }
        @media (max-width: 767px) { .hiw-nav-pad { padding: 0 24px !important; } }
        @media (min-width: 768px) and (max-width: 1023px) { .hiw-nav-pad { padding: 0 40px !important; } }
      `}</style>
    </>
  );
}
