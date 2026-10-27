'use client'

import { useEffect, useRef } from 'react'

const NODES = [
  { x: '8%',  y: '15%', size: 38, icon: 'fa-solid fa-bolt',           color: 'rgba(25,195,160,0.15)',  iconColor: 'rgba(25,195,160,0.55)',  dur: '9s',  delay: '0s',   ty: '-24px' },
  { x: '22%', y: '72%', size: 34, icon: 'fa-solid fa-robot',          color: 'rgba(76,91,255,0.12)',   iconColor: 'rgba(76,91,255,0.5)',    dur: '11s', delay: '-3s',  ty: '-18px' },
  { x: '78%', y: '12%', size: 42, icon: 'fa-solid fa-network-wired',  color: 'rgba(76,91,255,0.12)',   iconColor: 'rgba(76,91,255,0.5)',    dur: '13s', delay: '-6s',  ty: '-20px' },
  { x: '90%', y: '60%', size: 36, icon: 'fa-solid fa-gear',           color: 'rgba(25,195,160,0.13)',  iconColor: 'rgba(25,195,160,0.5)',   dur: '10s', delay: '-2s',  ty: '-22px' },
  { x: '55%', y: '85%', size: 32, icon: 'fa-solid fa-code',           color: 'rgba(25,195,160,0.1)',   iconColor: 'rgba(25,195,160,0.45)',  dur: '14s', delay: '-8s',  ty: '-16px' },
  { x: '42%', y: '5%',  size: 30, icon: 'fa-solid fa-database',       color: 'rgba(76,91,255,0.1)',    iconColor: 'rgba(76,91,255,0.4)',    dur: '12s', delay: '-5s',  ty: '-20px' },
  { x: '68%', y: '45%', size: 28, icon: 'fa-solid fa-cloud',          color: 'rgba(25,195,160,0.1)',   iconColor: 'rgba(25,195,160,0.4)',   dur: '15s', delay: '-9s',  ty: '-14px' },
  { x: '5%',  y: '50%', size: 26, icon: 'fa-solid fa-microchip',      color: 'rgba(76,91,255,0.1)',    iconColor: 'rgba(76,91,255,0.4)',    dur: '16s', delay: '-4s',  ty: '-18px' },
  { x: '33%', y: '38%', size: 24, icon: 'fa-solid fa-chart-line',     color: 'rgba(25,195,160,0.08)',  iconColor: 'rgba(25,195,160,0.35)',  dur: '18s', delay: '-7s',  ty: '-12px' },
  { x: '85%', y: '30%', size: 22, icon: 'fa-brands fa-whatsapp',      color: 'rgba(37,211,102,0.1)',   iconColor: 'rgba(37,211,102,0.4)',   dur: '11s', delay: '-11s', ty: '-16px' },
]

const ORBITS = [
  { x: '-80px', y: '30%', size: 240, dur: '28s', delay: '0s'  },
  { x: '80%',   y: '60%', size: 160, dur: '20s', delay: '-6s' },
  { x: '40%',   y: '-40px', size: 200, dur: '34s', delay: '-12s' },
]

const LINES = [
  { x1: '8%',  y1: '18%', x2: '22%', y2: '70%', delay: '0s'  },
  { x1: '78%', y1: '15%', x2: '90%', y2: '58%', delay: '1.5s' },
  { x1: '22%', y1: '70%', x2: '42%', y2: '8%',  delay: '3s'  },
  { x1: '55%', y1: '83%', x2: '68%', y2: '48%', delay: '0.8s' },
  { x1: '68%', y1: '48%', x2: '90%', y2: '60%', delay: '2s'  },
]

export default function AutoBg() {
  return (
    <div className="auto-bg-canvas" aria-hidden="true">
      {/* Orbiting rings */}
      {ORBITS.map((o, i) => (
        <div
          key={i}
          className="auto-orbit"
          style={{
            left: o.x,
            top: o.y,
            width: o.size,
            height: o.size,
            // @ts-ignore
            '--dur': o.dur,
            '--delay': o.delay,
          }}
        />
      ))}

      {/* SVG lines between nodes */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        {LINES.map((l, i) => (
          <line
            key={i}
            x1={l.x1} y1={l.y1}
            x2={l.x2} y2={l.y2}
            stroke="url(#lineGrad)"
            strokeWidth="1"
            strokeDasharray="6 8"
            style={{ opacity: 0.13, animation: `autoLinePulse 3s ease-in-out infinite`, animationDelay: l.delay }}
          />
        ))}
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#19C3A0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4C5BFF" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating icon nodes */}
      {NODES.map((n, i) => (
        <div
          key={i}
          className="auto-node"
          style={{
            left: n.x,
            top: n.y,
            width: n.size,
            height: n.size,
            background: n.color,
            border: `1px solid ${n.iconColor.replace('0.5', '0.2').replace('0.55', '0.22').replace('0.45', '0.18').replace('0.4', '0.16').replace('0.35', '0.14')}`,
            backdropFilter: 'blur(6px)',
            // @ts-ignore
            '--dur': n.dur,
            '--delay': n.delay,
            '--ty': n.ty,
            '--fs': `${n.size * 0.38}px`,
          }}
        >
          <div className="auto-node-inner" style={{ color: n.iconColor }}>
            <i className={n.icon} />
          </div>
        </div>
      ))}
    </div>
  )
}
