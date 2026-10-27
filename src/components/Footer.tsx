'use client'

import SaikoraLogo from '@/components/SaikoraLogo'

const footerLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/saikora_org?vrfl=MnZyMTFsMG1oejBm', iconClass: 'fa-brands fa-instagram' },
  { label: 'Facebook', href: 'https://facebook.com', iconClass: 'fa-brands fa-facebook' },
]

const footerTags = [
  { label: 'Ideas' },
  { label: 'Tecnología' },
  { label: 'Resultados' },
]

export default function Footer() {
  return (
    <footer className="saikora-footer">
      <div className="container">
        {/* Top row */}
        <div
          className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4 pb-4"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          {/* Brand Logo */}
          <a href="#inicio" className="text-decoration-none">
            <SaikoraLogo size={34} textColor="#FFFFFF" />
          </a>

          {/* Navigation links */}
          <nav className="d-flex flex-wrap gap-4 justify-content-center">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href} className="footer-nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social icons */}
          <div className="d-flex gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label={social.label}
              >
                <i className={social.iconClass}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 pt-4">
          <p className="footer-copyright mb-0">
            &copy; 2026 Saikora. Todos los derechos reservados.
          </p>

          <div className="d-flex align-items-center gap-2">
            {footerTags.map((tag, idx) => (
              <span key={tag.label} className="d-inline-flex align-items-center">
                <span className="footer-tag">{tag.label}</span>
                {idx < footerTags.length - 1 && (
                  <span
                    style={{
                      color: 'var(--sk-teal)',
                      fontSize: '0.65rem',
                      margin: '0 0.5rem',
                    }}
                  >
                    ✦
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}