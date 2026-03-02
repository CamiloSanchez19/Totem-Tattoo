import Layout from '../components/Layout'
import { useJQueryPlugins } from '../hooks/useJQueryPlugins'
import GallerySection from '../components/sections/GallerySection'
import TeamSection from '../components/sections/TeamSection'
import CoversTattoo from '../components/sections/CoversTattoo'

const aboutContent = `
    <section class="page-banner-section" style="background-image: url(/images/background/3.jpg)">
      <div class="auto-container">
        <div class="title">Since 2006</div>
        <h1>Portafolio</h1>
        <h2>Trabajos Destacados</h2>
      </div>
    </section>

`

function Portafolio() {
  useJQueryPlugins()
  
  return (
    <Layout>
      <div dangerouslySetInnerHTML={{ __html: aboutContent }} />
      <GallerySection />
      <CoversTattoo />
      <TeamSection />
    </Layout>
  )
}

export default Portafolio
