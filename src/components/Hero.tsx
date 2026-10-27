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
              <br />
              escala sin límites con
              <br />
              <span className="highlight">tecnología a medida</span>
            </h1>

            {/* Description */}
            <p className="hero-desc">
              En Saikora desarrollamos soluciones tecnológicas a medida para
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
              <div
                style={{
                  position: 'absolute',
                  width: '380px',
                  height: '110px',
                  borderRadius: '50%',
                  bottom: '50px',
                  background:
                    'radial-gradient(ellipse at center, rgba(25, 195, 160, 0.4) 0%, rgba(76, 91, 255, 0.25) 50%, transparent 75%)',
                  boxShadow: '0 0 60px rgba(25, 195, 160, 0.35)',
                  filter: 'blur(10px)',
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '320px',
                  height: '75px',
                  borderRadius: '50%',
                  bottom: '68px',
                  border: '1.5px solid rgba(25, 195, 160, 0.4)',
                  background: 'rgba(255, 255, 255, 0.45)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: 'inset 0 2px 14px rgba(255, 255, 255, 0.9), 0 16px 36px rgba(26, 30, 41, 0.08)',
                  zIndex: 2,
                }}
              />

              {/* Central 3D Ribbon S sculpture */}
              <div
                className="hero-logo-3d position-relative"
                style={{
                  zIndex: 3,
                  width: '310px',
                  height: '350px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/saikora-icon.png"
                  alt="Saikora 3D Visual"
                  width={310}
                  height={350}
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                    filter:
                      'drop-shadow(0 25px 35px rgba(26, 30, 41, 0.2)) drop-shadow(0 0 45px rgba(25, 195, 160, 0.3))',
                  }}
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