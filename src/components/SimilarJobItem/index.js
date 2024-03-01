import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {MdWork} from 'react-icons/md'
import './index.css'

const SimilarJobItem = props => {
  const {details} = props
  const {
    title,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
  } = details

  return (
    <div className="similar-card-item">
      <div className="company-logo-rating-container">
        <img src={companyLogoUrl} alt={title} />
        <div className="card-text-container">
          <h1>{title}</h1>
          <div className="ratings-container">
            <FaStar size="28px" fill="#fbbf24" />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <div className="type-salary-container">
        <div className="location-container">
          <IoLocationSharp size="28px" />
          <p>{location}</p>
          <MdWork size="28px" />
          <p>{employmentType}</p>
        </div>
        <div className="salary-container">
          <p>{packagePerAnnum}</p>
        </div>
      </div>
      <div className="description-container">
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </div>
    </div>
  )
}

export default SimilarJobItem
