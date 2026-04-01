interface NavBarProps {
  onStart: () => void;
  onHowItWorks: () => void;
  onLogoClick?: () => void;
}

export default function NavBar({ onStart, onHowItWorks, onLogoClick }: NavBarProps) {
  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between hiw-nav-pad"
        style={{
          height: '72px',
          background: 'rgba(6,12,24,0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(28,47,74,0.6)',
        }}
      >
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onLogoClick}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(0,229,160,0.12)',
              border: '1px solid rgba(0,229,160,0.25)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12h4l3-9 4 18 3-9h4"
                stroke="#00E5A0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-serif" style={{ fontSize: '1.4rem', color: '#fff' }}>
            StepIQ
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span
            onClick={onHowItWorks}
            className="hidden sm:inline font-mono cursor-pointer hover:text-[#EEF2FF] transition-colors"
            style={{ fontSize: '0.8rem', color: '#5A7090' }}
          >
            How it works
          </span>
          <button
            onClick={onStart}
            className="font-mono cursor-pointer transition-all hover:bg-[#00E5A0]/10"
            style={{
              fontSize: '0.75rem',
              color: '#00E5A0',
              border: '1px solid #00E5A0',
              background: 'transparent',
              padding: '8px 20px',
              borderRadius: '8px',
            }}
          >
            Start Assessment
          </button>
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
