import { memo } from 'react'

function GallerySection() {
  const galleryItems = [
    { id: 1, src: '/images/gallery/blackwork-2.jpg', alt: 'Gallery 1', categories: ['all', 'blackwork'] },
    { id: 2, src: '/images/gallery/blackwork-1.jpg', alt: 'Gallery 2', categories: ['all', 'blackwork'] },
    { id: 3, src: '/images/gallery/dorwork-1.jpg', alt: 'Gallery 3', categories: ['all', 'dotwork'] },
    { id: 5, src: '/images/gallery/realismo-1.jpg', alt: 'Gallery 5', categories: ['all', 'realismo'] },
    { id: 6, src: '/images/gallery/realismo-2.jpg', alt: 'Gallery 6', categories: ['all', 'realismo'] }
  ]

  return (
    <section className="gallery-section">
      <div className="sortable-masonry">
        <div className="auto-container">
          <div className="filters">
            <div className="section-title">
              <div className="clearfix">
                <div className="pull-left">
                  <h2>Trabajos Realizados</h2>
                </div>
                <div className="pull-right">
                  <ul className="filter-tabs filter-btns clearfix">
                    <li className="filter active" data-role="button" data-filter=".all">Todos</li>
                    <li className="filter" data-role="button" data-filter=".realismo">Realismo</li>
                    <li className="filter" data-role="button" data-filter=".blackwork">Blackwork</li>
                    <li className="filter" data-role="button" data-filter=".dotwork">Dotwork</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="items-container clearfix">
          {galleryItems.map((item) => (
            <div key={item.id} className={`gallery-block masonry-item ${item.categories.join(' ')} ${item.id === 1 ? 'col-lg-6 col-md-12' : 'col-lg-3 col-md-6'} col-sm-12`}>
              <div className="inner-box">
                <div className="image">
                  <a className="lightbox-image" data-fancybox="gallery" href={item.src}>
                    <img src={item.src} alt={item.alt} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(GallerySection)
