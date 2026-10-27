import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Stats from '@/components/Stats'
import Cases from '@/components/Cases'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import AutoBg from '@/components/AutoBg'

export default function HomePage() {
  return (
    <>
      <AutoBg />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Hero />
        <Services />
        <Stats />
        <Cases />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
