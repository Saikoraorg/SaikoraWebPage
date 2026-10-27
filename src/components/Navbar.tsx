'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SaikoraLogo from '@/components/SaikoraLogo'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#contacto' },
  ]

  return (
    <nav className={`saikora-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link href="#inicio" className="text-decoration-none">
            <SaikoraLogo size={38} textColor="#1A1E29" />
          </Link>

          {/* Desktop Nav */}
          <div className="d-none d-lg-flex align-items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="sk-nav-link">
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="d-none d-lg-block">
            <a href="#contacto" className="btn-sk-primary" id="nav-cta-btn">
              <span>Solicitar cotización</span>
              <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.82rem' }}></i>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="d-lg-none border-0 bg-transparent p-2 text-dark"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-btn"
            style={{ fontSize: '1.3rem', cursor: 'pointer' }}
          >
            <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div
            className="d-lg-none mt-3 p-3 rounded-4 shadow-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(26, 30, 41, 0.08)',
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            <div className="d-flex flex-column gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="sk-nav-link py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contacto"
                className="btn-sk-primary mt-2 text-center justify-content-center"
                onClick={() => setMenuOpen(false)}
              >
                <span>Solicitar cotización</span>
                <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.82rem' }}></i>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
