import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { HEADER_STYLE_TWO_PAGES } from '../config/constants'
import CartDropdown from './CartDropdown'
import '@fortawesome/fontawesome-free/css/all.min.css';
function Header() {
  const location = useLocation()
  
  // Páginas que necesitan el estilo de header alternativo
  const isHeaderStyle2 = HEADER_STYLE_TWO_PAGES.includes(location.pathname)
  
  // Logo diferente para páginas con header-style-two
  const logoSrc = isHeaderStyle2 ? '/images/logo.png' : '/images/logo.png'
  
  useEffect(() => {
    // Inicializar el menú móvil
    const initMobileMenu = () => {
      const mobileNavToggler = document.querySelector('.mobile-nav-toggler')
      const mobileMenuBackdrop = document.querySelector('.mobile-menu .menu-backdrop')
      const closeBtn = document.querySelector('.mobile-menu .close-btn')
      
      if (mobileNavToggler) {
        mobileNavToggler.addEventListener('click', function() {
          document.body.classList.add('mobile-menu-visible')
        })
      }
      
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          document.body.classList.remove('mobile-menu-visible')
        })
      }
      
      if (mobileMenuBackdrop) {
        mobileMenuBackdrop.addEventListener('click', function() {
          document.body.classList.remove('mobile-menu-visible')
        })
      }
      
      // Clonar el menú de navegación para el menú móvil
      const navigationMenu = document.querySelector('.main-menu .navigation')
      const mobileMenuOuter = document.querySelector('.mobile-menu .menu-outer')
      
      if (navigationMenu && mobileMenuOuter) {
        const clonedNav = navigationMenu.cloneNode(true)
        mobileMenuOuter.innerHTML = ''
        mobileMenuOuter.appendChild(clonedNav)
        
        // Agregar botones dropdown para el menú móvil
        const dropdowns = mobileMenuOuter.querySelectorAll('.dropdown')
        dropdowns.forEach(dropdown => {
          const dropdownBtn = document.createElement('div')
          dropdownBtn.className = 'dropdown-btn'
          dropdownBtn.innerHTML = '<span class="fa fa-angle-down"></span>'
          dropdown.appendChild(dropdownBtn)
          
          dropdownBtn.addEventListener('click', function(e) {
            e.preventDefault()
            const submenu = dropdown.querySelector('ul')
            if (submenu) {
              submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block'
            }
          })
        })
      }
    }
    
    initMobileMenu()
    
    // Cleanup
    return () => {
      document.body.classList.remove('mobile-menu-visible')
    }
  }, [location.pathname])
  
  return (
    <header className={`main-header ${isHeaderStyle2 ? 'header-style-two' : ''}`}>
      <div className="header-upper">
        <div className="auto-container">
          <div className="clearfix">
            <div className="pull-left logo-box">
              <div className="logo">
                <Link to="/">
                  <img src={logoSrc} alt="Barbero logo" title="Barbero" />
                </Link>
              </div>
            </div>

            <div className="nav-outer clearfix">
              <div className="mobile-nav-toggler">
                <span className="icon flaticon-menu"></span>
              </div>

              <nav className="main-menu navbar-expand-md">
                <div className="navbar-header">
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                </div>

                <div className="navbar-collapse show collapse clearfix" id="navbarSupportedContent">
                  <ul className="navigation left-nav clearfix">
                    <li>
                      <Link to="/">Inicio</Link>
                    </li>
                    <li className="dropdown">
                      <Link to="/portafolio">Portafolio</Link>
                    </li>
                  </ul>

                  <ul className="navigation right-nav clearfix">
                    <li className="dropdown">
                      <Link to="/reservas">Reservas</Link>
              
                    </li>
                    <li>
                      <Link to="/productos">Productos</Link>
                    </li>
                  </ul>
                </div>
              </nav>

              <ul className="social-box">
                <li>
                  <a href="https://twitter.com/">
                    <span className="fab fa-tiktok"></span>
                  </a>
                </li>
                <li>
                  <a href="https://www.behance.net/">
                    <span className="fab fa-facebook"></span>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/">
                    <span className="fab fa-instagram"></span>
                  </a>
                </li>
              </ul>

              <div className="outer-box clearfix">
                <ul className="options-nav">
                  <li className="search-box-outer icon-magnifier"></li>
                </ul>
                <div className="cart-box">
                  <CartDropdown />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mobile-menu">
        <div className="menu-backdrop"></div>
        <div className="close-btn">
          <span className="icon lnr lnr-cross"></span>
        </div>

        <nav className="menu-box">
          <div className="nav-logo">
            <Link to="/">
              <img src="/images/logo.png" alt="Barbero" title="Barbero" />
            </Link>
          </div>
          <div className="menu-outer"></div>
        </nav>
      </div>
    </header>
  )
}

export default Header
