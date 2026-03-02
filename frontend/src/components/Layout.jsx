import Footer from './Footer'
import Header from './Header'
import SearchPopup from './SearchPopup'
import { useInternalLinks } from '../hooks/useInternalLinks'

function Layout({ children, footerVariant = 'style-two', footerBackground = '/images/background/2.jpg' }) {
  useInternalLinks()
  
  return (
    <div className="page-wrapper">
      <Header />
      {children}
      <Footer variant={footerVariant} background={footerBackground} />
      <SearchPopup />
      <div className="scroll-to-top scroll-to-target" data-target="html">
        <span className="fa fa-arrow-circle-up"></span>
      </div>
    </div>
  )
}

export default Layout
