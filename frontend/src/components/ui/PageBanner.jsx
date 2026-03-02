import PropTypes from 'prop-types'

function PageBanner({ title, subtitle, backgroundImage }) {
  return (
    <section 
      className="page-banner-section" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="auto-container">
        <div className="title">{subtitle}</div>
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
      </div>
    </section>
  )
}

PageBanner.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string.isRequired,
}

export default PageBanner
