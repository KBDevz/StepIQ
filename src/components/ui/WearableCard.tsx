interface WearableCardProps {
  connected: boolean;
  provider: string | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onSignIn: () => void;
}

export default function WearableCard({
  connected,
  provider,
  loading,
  error,
  isLoggedIn,
  onConnect,
  onDisconnect,
  onSignIn,
}: WearableCardProps) {
  return (
    <div style={{
      background: 'var(--surface2)',
      border: `1px solid ${connected ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: '10px',
      padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          {/* Watch icon */}
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
            background: connected ? 'var(--accent-glow)' : 'var(--surface3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: connected ? 'var(--accent)' : 'var(--text2)' }}>
              <rect x="5" y="2" width="14" height="20" rx="7" stroke="currentColor" />
              <path d="M12 10v2l1 1" stroke="currentColor" />
            </svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <p className="font-mono" style={{
              fontSize: '0.75rem', fontWeight: 600,
              color: connected ? 'var(--accent)' : 'var(--text)',
            }}>
              {connected ? 'Wearable Connected' : 'Connect Wearable'}
            </p>
            <p className="font-mono" style={{ fontSize: '0.58rem', color: 'var(--text2)', marginTop: '1px' }}>
              {connected
                ? `${provider ?? 'Device'} · HR auto-captured during test`
                : 'Auto-capture heart rate from your watch'}
            </p>
          </div>
        </div>

        {connected ? (
          <button
            type="button"
            onClick={onDisconnect}
            className="font-mono"
            style={{
              fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'var(--text2)', background: 'transparent',
              border: '1px solid var(--border)', borderRadius: '16px',
              padding: '4px 10px', cursor: 'pointer', flexShrink: 0,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--danger)'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text2)'; }}
          >
            Remove
          </button>
        ) : isLoggedIn ? (
          <button
            type="button"
            onClick={onConnect}
            disabled={loading}
            className="font-mono"
            style={{
              fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em',
              fontWeight: 600, flexShrink: 0,
              color: loading ? 'var(--text2)' : 'var(--accent)',
              background: loading ? 'var(--surface3)' : 'var(--accent-glow)',
              border: `1px solid ${loading ? 'var(--border)' : 'rgba(0,184,162,0.3)'}`,
              borderRadius: '16px',
              padding: '5px 12px', cursor: loading ? 'wait' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Connecting…' : 'Connect'}
          </button>
        ) : (
          <button
            type="button"
            onClick={onSignIn}
            className="font-mono"
            style={{
              fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'var(--text2)', background: 'transparent',
              border: '1px solid var(--border)', borderRadius: '16px',
              padding: '4px 10px', cursor: 'pointer', flexShrink: 0,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text2)'; }}
          >
            Sign in to connect
          </button>
        )}
      </div>

      {error && (
        <p className="font-mono" style={{
          fontSize: '0.58rem', color: 'var(--danger)', marginTop: '8px',
        }}>
          {error}
        </p>
      )}
    </div>
  );
}
