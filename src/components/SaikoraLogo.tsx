'use client'

import Image from 'next/image'

export default function SaikoraLogo({
  size = 38,
  showText = true,
  textColor = '#1A1E29',
  className = '',
}: {
  size?: number
  showText?: boolean
  textColor?: string
  className?: string
}) {
  return (
    <div
      className={`d-inline-flex align-items-center gap-2 ${className}`}
      style={{ userSelect: 'none' }}
    >
      <Image
        src="/saikora-icon.png"
        alt="Saikora Logo"
        width={size}
        height={Math.round(size * 1.14)}
        style={{
          width: `${size}px`,
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
        priority
      />
      {showText && (
        <span
          style={{
            fontFamily: 'var(--font), Inter, sans-serif',
            fontWeight: 800,
            fontSize: `${Math.max(16, Math.round(size * 0.52))}px`,
            letterSpacing: '0.14em',
            display: 'inline-flex',
            alignItems: 'center',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: textColor, transition: 'color 0.2s ease' }}>
            S
          </span>
          <span className="saikora-logo-ai">
            AI
          </span>
          <span style={{ color: textColor, transition: 'color 0.2s ease' }}>
            KORA
          </span>
        </span>
      )}
    </div>
  )
}
