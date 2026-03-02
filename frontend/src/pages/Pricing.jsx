import Layout from '../components/Layout'
import PageTitle from '../components/ui/PageTitle'
import ServicesSection from '../components/sections/ServicesSection'
import TestimonialsSyncSection from '../components/sections/TestimonialsSyncSection'
import ReserveSection from '../components/sections/ReserveSection'
import { useJQueryPlugins } from '../hooks/useJQueryPlugins'

function Pricing() {
  useJQueryPlugins()
  
  return (
    <Layout>
      <PageTitle 
        title="Servicios" 
        breadcrumbs={[
          { text: 'Home', link: '/' },
          { text: 'Servicios' }
        ]} 
      />
      
      <ServicesSection title="Servicios y estilos" />
      
      <TestimonialsSyncSection />
      
      <ReserveSection />
    </Layout>
  )
}

export default Pricing


