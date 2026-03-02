import { memo } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css';

function TeamSection() {
  const team = [
    { id: 1, name: 'Erik Roa', role: 'Tattoo Artist', image: '/images/resource/tatuador-1.jpg', animation: 'fadeInLeft' },
    { id: 2, name: 'Axel Pineda', role: 'Tattoo Artist', image: '/images/resource/tatuador-2.jpg', animation: 'fadeInUp' },
    { id: 3, name: 'Laura Jimenez', role: 'Tattoo Artist', image: '/images/resource/tatuador-3.jpg', animation: 'fadeInRight' }
  ]

  const socials = [
    { icon: 'fab fa-tiktok', href: 'https://twitter.com/' },
    { icon: 'fab fa-facebook', href: 'http://facebook.com/' },
    { icon: 'fab fa-instagram', href: 'http://google.com/' },
    { icon: 'fab fa-linkedin', href: 'http://linkedin.com/' }
  ]

  return (
    <section className="team-section">
      <div className="auto-container">
        <div className="section-title centered light">
          <h2>Nuestros Artistas</h2>
        </div>
        <div className="row clearfix">
          {team.map((member) => (
            <div key={member.id} className="team-block col-lg-4 col-md-6 col-sm-12">
              <div className={`inner-box wow ${member.animation}`} data-wow-delay="0ms" data-wow-duration="1500ms">
                <div className="image">
                  <a href="/portafolio">
                    <img src={member.image} alt={member.name} />
                  </a>
                  <ul className="social-icons">
                    {socials.map((social, idx) => (
                      <li key={idx}>
                        <a href={social.href} className={social.icon}></a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lower-content">
                  <h4><a href="/portafolio">{member.name}</a></h4>
                  <div className="designation">{member.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(TeamSection)
