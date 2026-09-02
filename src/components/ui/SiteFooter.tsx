import ThemeToggle from './ThemeToggle';

interface SiteFooterProps {
  onStart?: () => void;
  onHowItWorks?: () => void;
}

const col = (title: string, links: { label: string; href?: string; onClick?: () => void }[]) => (
  <div>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '16px' }}>
      {title}
    </p>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href || '#'}
            onClick={l.onClick ? (e) => { e.preventDefault(); l.onClick?.(); } : undefined}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text2)', textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; }}
          >
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default function SiteFooter({ onStart, onHowItWorks }: SiteFooterProps) {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div className="mk-container" style={{ padding: '64px 32px 32px' }}>
        <div className="site-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 12h4l3-9 4 18 3-9h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text)' }}>StepIQ</span>
            </div>
            <p className="mk-body" style={{ maxWidth: '340px' }}>
              Clinical-grade VO₂ max assessment you can run anywhere — at home, in a clinic, or across a whole workforce.
            </p>
          </div>
          {col('Product', [
            { label: 'Take the test', onClick: onStart },
            { label: 'How it works', onClick: onHowItWorks },
            { label: 'Sample report', href: '/report/demo' },
          ])}
          {col('For professionals', [
            { label: 'Clinics & practices', href: '/clinics' },
            { label: 'Gyms & wellness', href: '/facilities' },
            { label: 'Teams & departments', href: '/teams' },
          ])}
          {col('Company', [
            { label: 'Send feedback', href: 'mailto:keith@stepiq.app?subject=StepIQ%20Feedback' },
            { label: 'Book a demo', href: 'mailto:hello@stepiq.app?subject=StepIQ%20Demo' },
          ])}
        </div>

        <div className="mk-divider" style={{ margin: '48px 0 24px' }} />

        <div className="site-footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <p className="mk-small">
            Built on the Chester Step Test protocol (Sykes &amp; Roberts, 2004). Not a substitute for medical advice.
          </p>
          <ThemeToggle />
        </div>
      </div>
      <style>{`
        @media (max-width: 1023px) { .site-footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 640px) { .site-footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; } }
      `}</style>
    </footer>
  );
}
