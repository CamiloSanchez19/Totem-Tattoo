import Layout from '../components/Layout'
import { useJQueryPlugins } from '../hooks/useJQueryPlugins'
import BannerSection from '../components/sections/BannerSection'
import ReserveSection from '../components/sections/ReserveSection'
import ServicesSection from '../components/sections/ServicesSection'
import TestimonialsSyncSection from '../components/sections/TestimonialsSyncSection'
import TeamSection from '../components/sections/TeamSection'
import NewsSection from '../components/sections/NewsSection'

function Home() {
  useJQueryPlugins()
  
  return (
    <Layout>
      <BannerSection />
      <ReserveSection />
      <ServicesSection />
      <TestimonialsSyncSection />
      <TeamSection />
      <NewsSection />
    </Layout>
  )
}

export default Home
