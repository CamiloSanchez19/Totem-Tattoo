import { memo } from 'react'

function NewsSection() {
  const news = [
    { id: 1, category: '🐺 Cover Up Realista – Lobo', title: 'De un tatuaje desgastado a un lobo realista lleno de fuerza, detalle y simbolismo.', date: 'Diciembre 25, 2024', image: '/images/resource/cover-1.png' },
    { id: 2, category: '🐉 Cover Up Color – Dragón', title: 'Un lettering antiguo transformado en un dragón vibrante, intenso y lleno de energía.', date: 'Enero 10, 2025', image: '/images/resource/cover-2.png' },
    { id: 3, category: '💀 Cover Up Dark Art – Calavera', title: 'Evolución total hacia una calavera en llamas con alto impacto visual y profundidad.', date: 'Julio 15, 2025', image: '/images/resource/cover-3.png' }
  ]

  return (
    <section className="news-section">
      <div className="auto-container">
        <div className="inner-container">
          <div className="section-title">
            <div className="clearfix">
              <div className="pull-left">
                <h2>Antes & Después</h2>
              </div>
              <div className="pull-right">
                <a href="/portafolio" className="articles">mas resultados</a>
              </div>
            </div>
          </div>
          <div className="row clearfix">
            {news.map((article) => (
              <div key={article.id} className="news-block col-lg-4 col-md-6 col-sm-12">
                <div className="inner-box">
                  <div className="image">
                    <a><img src={article.image} alt={article.title} /></a>
                  </div>
                  <div className="lower-content">
                    <div className="title">{article.category}</div>
                    <h4><a >{article.title}</a></h4>
                    <div className="post-date">{article.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(NewsSection)
