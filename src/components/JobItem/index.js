import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {MdWork} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import {GoLinkExternal} from 'react-icons/go'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

import './index.css'

class JobItem extends Component {
  state = {apiStatus: 'LOADING', jobDetails: {}, similarJobs: []}

  componentDidMount() {
    const {match} = this.props
    const {id} = match.params
    this.getItemDetails(id)
  }

  getItemDetails = async id => {
    const jwtToken = Cookies.get('jwt_token')
    console.log(id)
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(apiUrl, options)
      if (!response.ok) {
        console.log('Failed to fetch')
        this.setState({apiStatus: 'FAILED'})
      } else {
        const data = await response.json()
        const {job_details: jobDetails, similar_jobs: similarJobs} = data
        const updatedJobDetails = {
          id: jobDetails.id,
          title: jobDetails.title,
          companyLogoUrl: jobDetails.company_logo_url,
          companyWebsiteUrl: jobDetails.company_website_url,
          employmentType: jobDetails.employment_type,
          jobDescription: jobDetails.job_description,
          lifeAtCompany: jobDetails.life_at_company,
          location: jobDetails.location,
          packagePerAnnum: jobDetails.package_per_annum,
          rating: jobDetails.rating,
          skills: jobDetails.skills,
        }
        console.log(updatedJobDetails)
        const {skills} = updatedJobDetails

        const updatedSimilarJobs = similarJobs.map(eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          location: eachItem.location,
          rating: eachItem.rating,
          title: eachItem.title,
        }))

        this.setState({
          apiStatus: 'SUCCESS',
          jobDetails: updatedJobDetails,
          similarJobs: updatedSimilarJobs,
          skills,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  renderjobDetailsCard = () => {
    const {jobDetails, similarJobs, apiStatus, skills} = this.state
    const {
      title,
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
    } = jobDetails

    switch (apiStatus) {
      case 'LOADING':
        return this.renderLoading()
      case 'SUCCESS':
        return (
          <>
            <li className="card-item similar-job-card">
              <div className="company-logo-rating-container">
                <img src={companyLogoUrl} alt="job details company logo" />
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
                <div className="description-heading-contianer">
                  <h1>Description</h1>
                  <div className="link-container">
                    <a
                      href={companyWebsiteUrl}
                      aria-label="webiteurl"
                      target="_blank"
                    >
                      Visit
                      <GoLinkExternal size="28px" />
                    </a>
                  </div>
                </div>
                <p>{jobDescription}</p>
              </div>
              <div className="skills-bg-container">
                <h1>Skills</h1>
                <ul className="skills-container">
                  {skills.map(eachItem => (
                    <li className="skill-card" key={eachItem.id}>
                      <img src={eachItem.image_url} alt="name" />
                      <p>{eachItem.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="life-contianer">
                <div className="life-text-image-container">
                  <div className="life-text-container">
                    <h1>Life at Company</h1>
                    <p>{lifeAtCompany.description}</p>
                  </div>
                  <img src={lifeAtCompany.image_url} alt="Life at Company" />
                </div>
              </div>
            </li>

            <div className="similar-jobs-bg-container">
              <h1 className="text-center">Similar Jobs</h1>
              <ul className="similar-jobs-container">
                {similarJobs.map(eachItem => (
                  <SimilarJobItem key={eachItem.id} details={eachItem} />
                ))}
              </ul>
            </div>
          </>
        )

      case 'FAILED':
        return this.renderFailureScreen()
      default:
        return null
    }
  }

  renderFailureScreen = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button">Retry</button>
    </div>
  )

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    return (
      <div className="item-bg-container">
        <Header />
        {this.renderjobDetailsCard()}
      </div>
    )
  }
}

export default JobItem
