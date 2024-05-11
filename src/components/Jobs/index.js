import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {IoSearch} from 'react-icons/io5'
import './index.css'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobsCard from '../JobsCard'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    userDetails: {},
    profileDetailsLoaded: 'LOADING',
    jobTypes: [],
    salaryRange: '',
    searchInput: '',
    jobsList: '',
    gettingJobsList: 'LOADING',
  }

  componentDidMount() {
    this.getUserDetails()
    this.getJobDetails()
  }

  onRestart = () => {
    this.setState({gettingJobsList: 'LOADING'}, this.getJobDetails())
  }

  onProfileRestart = () => {
    this.setState({profileDetailsLoaded: 'LOADING'}, this.getUserDetails)
  }

  onSearchClick = () => {
    this.getJobDetails()
  }

  handleCheckboxChange = event => {
    const {value, checked} = event.target
    const {jobTypes} = this.state

    if (checked) {
      if (!jobTypes.includes(value)) {
        this.setState(
          prevState => ({
            jobTypes: [...prevState.jobTypes, value],
          }),
          this.getJobDetails,
        )
      }
    } else {
      this.setState(
        prevState => ({
          jobTypes: prevState.jobTypes.filter(item => item !== value),
        }),
        this.getJobDetails,
      )
    }
  }

  handleRadioboxChange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobDetails)
  }

  handleKeyDown = event => {
    this.setState({searchInput: event.target.value})
  }

  getUserDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(apiUrl, options)
      if (!response.ok) {
        throw new Error('Failed to fetch user details')
      }
      const data = await response.json()
      const {profile_details: profileDetails} = data

      const updatedUserDetails = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        userDetails: updatedUserDetails,
        profileDetailsLoaded: 'SUCCESS',
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      this.setState({profileDetailsLoaded: 'FAILED'})
    }
  }

  getJobDetails = async () => {
    try {
      const {jobTypes, salaryRange, searchInput} = this.state
      const jwtToken = Cookies.get('jwt_token')

      const jobTypesForSearch = jobTypes.join(',')
      const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${jobTypesForSearch}&minimum_package=${salaryRange}&search=${searchInput}`
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }

      const response = await fetch(apiUrl, options)

      if (!response.ok) {
        throw new Error('Failed to fetch job details')
      }

      const data = await response.json()
      console.log(data)
      const {jobs} = data

      if (jobs.length === 0) {
        this.setState({jobsList: [], gettingJobsList: 'EMPTY'})
      } else {
        const updatedJobsList = jobs.map(eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          rating: eachItem.rating,
          title: eachItem.title,
          location: eachItem.location,
          packagePerAnnum: eachItem.package_per_annum,
          jobDescription: eachItem.job_description,
        }))

        this.setState({jobsList: updatedJobsList, gettingJobsList: 'SUCCESS'})
      }
    } catch (error) {
      console.error('Error fetching job details:', error)
      this.setState({gettingJobsList: 'FAILED'})
    }
  }

  renderUserDetails = () => {
    const {userDetails, profileDetailsLoaded} = this.state
    const {name, profileImageUrl, shortBio} = userDetails

    switch (profileDetailsLoaded) {
      case 'SUCCESS':
        return (
          <div className="user-details-card">
            <div className="user-contents-container">
              <img src={profileImageUrl} alt="profile" />
              <h3 className="name">{name}</h3>
              <p className="bio">{shortBio}</p>
            </div>
          </div>
        )
      case 'LOADING':
        return this.renderLoading()
      case 'FAILED':
        return (
          <button
            className="retry-btn"
            onClick={this.onProfileRestart}
            type="button"
          >
            Retry
          </button>
        )
      default:
        return null
    }
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getCardsOfJobs = () => {
    const {jobsList, gettingJobsList} = this.state

    switch (gettingJobsList) {
      case 'SUCCESS':
        return (
          <ul className="jobs-list-container">
            {jobsList.map(eachItem => (
              <JobsCard key={eachItem.id} details={eachItem} />
            ))}
          </ul>
        )
      case 'LOADING':
        return this.renderLoading()
      case 'FAILED':
        return this.renderFailureScreen()
      case 'EMPTY':
        return this.noResultsScreen()
      default:
        return null
    }
  }

  noResultsScreen = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderFailureScreen = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button className="retry-btn" onClick={this.onRestart} type="button">
        Retry
      </button>
    </div>
  )

  render() {
    return (
      <div className="jobs-bg-container">
        <Header />

        <div className="job-responsive-container">
          <div className="profile-filter-container">
            {this.renderUserDetails()}
            <hr />

            <ul className="type-container">
              <h1>Types of Employment</h1>
              <form
                className="job-checkbox-container"
                onChange={this.handleCheckboxChange}
              >
                {employmentTypesList.map(type => (
                  <div key={type.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={`employmentType${type.employmentTypeId}`}
                      value={type.employmentTypeId}
                    />
                    <label htmlFor={`employmentType${type.employmentTypeId}`}>
                      {type.label}
                    </label>
                  </div>
                ))}
              </form>
            </ul>
            <hr />

            <ul className="range-container">
              <h1>Salary Range</h1>
              <form
                className="job-radio-container"
                onChange={this.handleRadioboxChange}
              >
                {salaryRangesList.map(range => (
                  <div key={range.salaryRangeId}>
                    <input
                      type="radio"
                      id={`salary${range.salaryRangeId}`}
                      name="salary"
                      value={range.salaryRangeId}
                    />
                    <label htmlFor={`salary${range.salaryRangeId}`}>
                      {range.label}
                    </label>
                  </div>
                ))}
              </form>
            </ul>
          </div>
          <ul className="jobs-list-container">
            <div className="search-element-container">
              <input
                type="search"
                className="search-element"
                placeholder="Search"
                onChange={this.handleKeyDown}
              />
              <button
                onClick={this.onSearchClick}
                className="search-button"
                type="button"
                data-testid="searchButton"
              >
                <IoSearch />
              </button>
            </div>

            {this.getCardsOfJobs()}
          </ul>
        </div>
      </div>
    )
  }
}

export default Jobs
