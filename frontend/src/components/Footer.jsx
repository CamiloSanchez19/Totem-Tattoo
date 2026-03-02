import '@fortawesome/fontawesome-free/css/all.min.css';
function Footer({ variant = 'style-two', background = '/images/background/2.jpg' }) {
  const footerClass = `main-footer ${variant}`.trim()
  return (
    <footer className={footerClass} style={{ backgroundImage: `url(${background})` }}>
      <div className="auto-container">
        <div className="widgets-section">
          <div className="row clearfix">
            <div className="footer-column col-lg-4 col-md-6 col-sm-12">
              <div className="footer-widget office-widget">
                <h4>Estudio</h4>
                <ul className="location-list">
                  <li>
                    Calle 67 Sur, Madelena, Bogota, 90210 <br /> Colombia
                  </li>
                  <li>
                    <a href="mailto:preguntas@TÓTEMstudio.co">preguntas@totemstudio.co</a>
                  </li>
                  <li>
                    <a href="tel:+0085-346-2188">+57 320 346 2188</a>
                  </li>
                </ul>
                <ul className="social-box">
                  <li>
                    <a href="https://twitter.com/" className="fab fa-tiktok"></a>
                  </li>
                  <li className="facebook">
                    <a href="http://facebook.com/" className="fab fa-facebook"></a>
                  </li>
                  <li className="instagram">
                    <a href="https://www.instagram.com/" className="fab fa-instagram"></a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-column col-lg-4 col-md-12 col-sm-12">
              <div className="footer-widget logo-widget">
                <div className="logo">
                  <a href="/">
                    <img src="/images/footer-logo.png" alt="tattoo" />
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-column col-lg-4 col-md-6 col-sm-12">
              <div className="footer-widget twitter-widget">
                <h4>nosotros</h4>
                <div className="tweet">
                   En TÓTEM TATTOO creemos que un tatuaje no es una moda, es un símbolo personal.
                  <br />
                  <div className="post-date">Identidad • Arte • Respeto</div>
                </div>
                <div className="tweet">
                  Diseñamos cada pieza desde cero, cuidando la piel, el proceso y la historia detrás de cada tatuaje.
                  <br />
                  <div className="post-date">Arte que se lleva para siempre</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="auto-container">
          <div className="copyright">
            <p className="copyright">
        © {new Date().getFullYear()} TÓTEM TATTOO — Creado por Camilo Sánchez.

            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
