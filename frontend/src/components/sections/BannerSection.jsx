import { useEffect, useRef } from 'react'

export default function BannerSection() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const tryPlay = () => {
      const playPromise = video.play()
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {})
      }
    }

    tryPlay()
    video.addEventListener('loadeddata', tryPlay)

    return () => {
      video.removeEventListener('loadeddata', tryPlay)
    }
  }, [])

  return (
    <section className="banner-section">
      <div className="banner-static-wrap">

        {/* SLIDE */}
        <div className="slide video-slide">
          {/* Video de fondo */}
          <video
            ref={videoRef}
            className="bg-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src="https://res.cloudinary.com/diqkjvk19/video/upload/f_auto,q_auto:good,vc_auto,w_1280/v1768728814/Video_T%C3%93TEM_m0mlbo.mp4" type="video/mp4" />
          </video>

          {/* Contenido */}
          <div className="auto-container">
            <div className="content-boxed">
              <div className="inner-box">
                <div className="title">Since 2006</div>
                <h1>TÓTEM</h1>
                <h2>Estudio profesional de tatuajes<br /> & arte corporal</h2>
                <div className="btn-box text-center">
                  <a href="/reservas" className="theme-btn btn-style-one banner-reserva-btn">
                    <span className="txt">Reserva</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div
        className="slider-icon-scroll scroll-to-target"
        data-target=".reserve-section"
      >
        <span className="icofont-scroll-down"></span>
      </div>
    </section>
  )
}
