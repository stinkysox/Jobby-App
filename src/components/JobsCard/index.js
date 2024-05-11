import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {MdWork} from 'react-icons/md'
import {Link} from 'react-router-dom'
import './index.css'

const JobsCard = props => {
  const {details} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    rating,
    title,
    packagePerAnnum,
    location,
    jobDescription,
  } = details

  return (
    <Link to={`/jobs/${id}`} className="link-element">
      <li className="card-item">
        <div className="company-logo-rating-container">
          <img src={companyLogoUrl} alt="company logo" />
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
        <hr />
        <div className="description-container">
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobsCard
