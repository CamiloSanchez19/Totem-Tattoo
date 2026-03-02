import PropTypes from 'prop-types'

function PriceBlock({ price, title, description, link = '/pricing' }) {
  return (
    <div className="price-block">
      <div className="inner-box">
        <div className="price">${price}</div>
        <h4><a href={link}>{title}</a></h4>
        <p>{description}</p>
      </div>
    </div>
  )
}

PriceBlock.propTypes = {
  price: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string,
}

export default PriceBlock
