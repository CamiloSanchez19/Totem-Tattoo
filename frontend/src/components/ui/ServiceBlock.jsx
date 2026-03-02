import PropTypes from 'prop-types'

function ServiceBlock({ title, description, image, link, id }) {
  const offsetClass = id === 5 ? 'offset-lg-1' : ''
  
  return (
    <div className={`service-block col-lg-3 col-md-6 col-sm-12 ${offsetClass}`}>
      <div className="inner-box">
        <div className="image">
          <img src={image} alt={title} />
        </div>
        <div className="lower-content">
          <h4><a href={link}>{title}</a></h4>
          <p>{description}</p>
        </div>
      </div>
    </div>
  )
}

ServiceBlock.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
}

export default ServiceBlock
