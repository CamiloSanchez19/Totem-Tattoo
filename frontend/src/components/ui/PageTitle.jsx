import PropTypes from 'prop-types'

function PageTitle({ title, breadcrumbs = [] }) {
  return (
    <div className="page-title-section">
      <div className="auto-container">
        <h1>{title}</h1>
        {breadcrumbs.length > 0 && (
          <ul className="post-meta">
            {breadcrumbs.map((item, index) => (
              <li key={index}>
                {item.link ? <a href={item.link}>{item.text}</a> : item.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      link: PropTypes.string,
    })
  ),
}

export default PageTitle
