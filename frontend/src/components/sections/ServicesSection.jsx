import PropTypes from 'prop-types'
import { SERVICES } from '../../config/constants'
import ServiceBlock from '../ui/ServiceBlock'

function ServicesSection({ variant = '', title = 'Nuestros Servicios' }) {
  return (
    <section className={`services-section ${variant}`}>
      <div className="auto-container">
        <div className="section-title centered">
          <h2>{title}</h2>
        </div>
        <div className="row clearfix">
          {SERVICES.map((service) => (
            <ServiceBlock
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              image={service.image}
              link={service.link}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

ServicesSection.propTypes = {
  variant: PropTypes.string,
  title: PropTypes.string,
}

export default ServicesSection
