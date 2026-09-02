import { useState, type CSSProperties } from 'react';

interface PhotoProps {
  /** Filename under /public/images, e.g. "hero-home.jpg" */
  name: string;
  alt: string;
  /** CSS aspect-ratio, e.g. "3 / 2" */
  ratio?: string;
  radius?: number;
  style?: CSSProperties;
  className?: string;
  priority?: boolean;
  /** Optional caption shown in the placeholder so it's obvious which file to drop in */
  hint?: string;
}

/**
 * Image slot that degrades gracefully. Point it at /images/<name>; if the
 * file isn't there yet it renders a soft editorial placeholder labelled
 * with the expected filename, so swapping in real photography is a
 * drag-and-drop into public/images with zero code changes.
 */
export default function Photo({ name, alt, ratio = '3 / 2', radius = 24, style, className, priority, hint }: PhotoProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        aspectRatio: ratio,
        borderRadius: radius,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--surface2) 0%, var(--surface3) 100%)',
        ...style,
      }}
    >
      {!failed && (
        <img
          src={`/images/${name}`}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}
      {failed && (
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '24px', textAlign: 'center',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text3)', letterSpacing: '0.02em' }}>
            {hint || alt}
          </span>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text3)', opacity: 0.8 }}>
            public/images/{name}
          </code>
        </div>
      )}
    </div>
  );
}
