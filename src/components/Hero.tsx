'use client'

import Image from 'next/image'

export default function Hero() {
  return (
    <section id="inicio" className="hero-section">
      {/* Background ambient blobs */}
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row align-items-center g-5">
          {/* Left Content */}
          <div className="col-lg-6">
            {/* Pill Badge */}
            <div className="hero-badge">
              <i className="fa-solid fa-bolt-lightning"></i>
              <span>AUTOMATIZACIÓN / SOFTWARE / TECNOLOGÍA</span>
            </div>

            {/* Main Heading */}
            <h1 className="hero-title">
              Automatiza tu negocio,
              <br className="d-none d-md-inline" />
              {' '}escala sin límites con
              <br className="d-none d-md-inline" />
              {' '}<span className="highlight">tecnología a medida</span>
            </h1>

            {/* Description */}
            <p className="hero-desc">
              Desarrollamos soluciones tecnológicas a medida para
              automatizar procesos, crear sitios web, desarrollar sistemas y
              llevar tu negocio al siguiente nivel.
            </p>



            {/* CTA Buttons */}
            <div className="d-flex flex-wrap align-items-center gap-3">
              <a href="#contacto" className="btn-sk-primary" id="hero-cta-primary">
                <span>Agenda una llamada gratis</span>
                <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.84rem' }}></i>
              </a>
              <a href="#servicios" className="btn-sk-outline" id="hero-cta-secondary">
                <span>Ver servicios</span>
                <i className="fa-regular fa-circle-play" style={{ fontSize: '0.92rem' }}></i>
              </a>
            </div>
          </div>

          {/* Right 3D Showcase */}
          <div className="col-lg-6">
            <div className="hero-visual">
              {/* Glowing Pedestal Base */}
              <div className="hero-pedestal-glow" />
              <div className="hero-pedestal-ring" />

              {/* Central 3D Ribbon S sculpture */}
              <div className="hero-logo-3d position-relative" style={{ overflow: 'hidden' }}>
                <Image
                  src="/saikora-icon.png"
                  alt="Saikora 3D Visual"
                  width={510}
                  height={510}
                  className="hero-ribbon-img"
                  priority
                />
              </div>

              {/* Floating Card 1 - Automatiza */}
              <div className="hero-float-card fc-1" style={{ zIndex: 4 }}>
                <div className="fc-icon fc-icon-teal">
                  <i className="fa-solid fa-gears"></i>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1A1E29', lineHeight: 1.2 }}>
                    Automatiza
                  </div>
                  <div style={{ fontWeight: 400, fontSize: '0.72rem', color: 'rgba(26,30,41,0.6)' }}>
                    tus procesos
                  </div>
                </div>
              </div>

              {/* Floating Card 2 - Sitios Web */}
              <div className="hero-float-card fc-2" style={{ zIndex: 4 }}>
                <div className="fc-icon fc-icon-blue">
                  <i className="fa-solid fa-globe"></i>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1A1E29', lineHeight: 1.2 }}>
                    Sitios web
                  </div>
                  <div style={{ fontWeight: 400, fontSize: '0.72rem', color: 'rgba(26,30,41,0.6)' }}>
                    que impulsan
                  </div>
                </div>
              </div>

              {/* Floating Card 3 - Sistemas a medida */}
              <div className="hero-float-card fc-3" style={{ zIndex: 4 }}>
                <div className="fc-icon fc-icon-teal">
                  <i className="fa-solid fa-code"></i>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1A1E29', lineHeight: 1.2 }}>
                    Sistemas
                  </div>
                  <div style={{ fontWeight: 400, fontSize: '0.72rem', color: 'rgba(26,30,41,0.6)' }}>
                    a medida
                  </div>
                </div>
              </div>

              {/* Glowing Pulse Orbs */}
              <div className="hero-orb hero-orb-1" />
              <div className="hero-orb hero-orb-2" />
              <div className="hero-orb hero-orb-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Modern Scroll Indicator */}
      <a href="#servicios" className="scroll-indicator text-decoration-none">
        <i className="fa-solid fa-computer-mouse" style={{ fontSize: '0.95rem' }}></i>
        <span>Scroll</span>
      </a>
    </section>
  )
}