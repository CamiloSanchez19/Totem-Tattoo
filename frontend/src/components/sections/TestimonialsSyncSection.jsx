import { memo } from 'react'

function TestimonialsSyncSection() {
  const testimonials = [
    {
      text: 'Desde el primer momento me sentí muy cómodo. Escucharon mi idea, la mejoraron y el resultado fue incluso mejor de lo que imaginaba. Mucha higiene y profesionalismo.',
      author: 'Carlos M.',
      role: 'Cliente'
    },
    {
      text: 'No es solo tatuarse, es toda una experiencia. Se toman el tiempo de explicarte el proceso y cuidan cada detalle. Sin duda volvería a tatuarme aquí.',
      author: 'Laura G.',
      role: 'Cliente'
    },
    {
      text: 'Llegué con un tatuaje viejo que no me gustaba y el cover up quedó brutal. Excelente técnica y muy buen trato. Recomendado al 100%.',
      author: 'Andrés R.',
      role: 'Cliente'
    },
    {
      text: 'El diseño fue totalmente personalizado y se adaptó perfecto a mi brazo. Se nota la experiencia y el amor por el arte.',
      author: 'Daniela P.',
      role: 'Cliente'
    },
    {
      text: 'Me daba miedo tatuarme por primera vez, pero me explicaron todo y me sentí tranquilo. El resultado quedó limpio y muy bien hecho.',
      author: 'Juan S.',
      role: 'Cliente'
    },
    {
      text: 'Un estudio serio, organizado y con muy buen nivel artístico. La atención y la calidad del trabajo hablan por sí solas.',
      author: 'Miguel A.',
      role: 'Cliente'
    }
  ]

  const authors = [
    { id: 1, src: '/images/resource/author-1.jpg' },
    { id: 2, src: '/images/resource/author-2.jpg' },
    { id: 3, src: '/images/resource/author-3.jpg' },
    { id: 4, src: '/images/resource/author-1.jpg' },
    { id: 5, src: '/images/resource/author-2.jpg' },
    { id: 6, src: '/images/resource/author-3.jpg' }
  ]

  return (
    <section
      className="testimonial-section"
      style={{ backgroundImage: 'url(/images/background/1.jpg)' }}
    >
      <div className="auto-container">
        <div className="title-box">
          <div className="logo-box">
            <img src="/images/logo.png" alt="Tótem Tattoo" />
          </div>
          <h2>Testimonios</h2>
        </div>

        <div className="testimonial-outer">
          <div className="quote-icon">
            <span className="quote"></span>
          </div>

          <div className="client-testimonial-carousel owl-carousel owl-theme">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="testimonial-block">
                <div className="inner-box">
                  <p>{testimonial.text}</p>
                  <div className="info-box">
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="fa fa-star"></span>
                      ))}
                    </div>
                    <div className="author-info">
                      {testimonial.author} - <span>{testimonial.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="client-thumb-outer">
            <div className="client-thumbs-carousel owl-carousel owl-theme">
              {authors.map((author) => (
                <div key={author.id} className="thumb-item">
                  <figure className="thumb-box">
                    <img src={author.src} alt="Cliente" />
                  </figure>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default memo(TestimonialsSyncSection)
