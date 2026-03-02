import PropTypes from 'prop-types'
import { APP_CONFIG } from '../../config/constants'

function ReserveSection() {
  return (
    <section className="reserve-section">
      <div className="auto-container">
        <div className="inner-container">
          <div className="row clearfix">
            <div className="logo-column col-lg-5 col-md-12 col-sm-12">
              <div className="inner-column">
                <div className="image">
                  <img src="/images/resource/reserve1.png" alt="Reserve" />
                </div>
              </div>
            </div>
            <div className="content-column col-lg-7 col-md-12 col-sm-12">
              <div className="inner-column">
                <h2>Diseño personalizado & tinta de alta calidad<br /> </h2>
                <p>
                  Somos un estudio de tatuajes donde cada diseño nace de una conversación, no de una plantilla.
                  Creamos piezas únicas, pensadas para tu piel y tu historia, cuidando cada detalle para que la experiencia sea tan importante como el tatuaje.
                  <br /> TÓTEM TATTOO
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

ReserveSection.propTypes = {}

export default ReserveSection
