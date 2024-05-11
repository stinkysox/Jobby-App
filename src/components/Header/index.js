// Import necessary modules
import './index.css'
import {FaHome, FaSignOutAlt, FaInfoCircle} from 'react-icons/fa'
import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const onLogOut = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <>
      {/* Large screen navigation bar */}
      <ul className="nav-bar nav-bar-large">
        <li className="nav-logo-container">
          {/* Website logo */}
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="nav-logo"
            />
          </Link>
        </li>
        {/* Navigation links */}
        <li className="nav-text-container">
          <Link to="/" className="link-option">
            <p className="nav-option">Home</p>
          </Link>
          <Link to="/jobs" className="link-option">
            <p className="nav-option">Jobs</p>
          </Link>
        </li>
        {/* Logout button */}
        <li className="nav-logout-container">
          <button type="button" className="logout-btn" onClick={onLogOut}>
            Logout
          </button>
        </li>
      </ul>

      {/* Small screen navigation bar */}
      <div className="nav-bar nav-bar-small">
        <div className="nav-logo-container">
          {/* Website logo */}
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="nav-logo"
          />
        </div>
        {/* Navigation icons */}
        <div className="nav-logo-container">
          <button className="nav-icons" type="button" aria-label="Home">
            <FaHome size="28px" />
          </button>
          <button className="nav-icons" type="button" aria-label="Info">
            <FaInfoCircle size="28px" />
          </button>
          <button
            className="nav-icons"
            onClick={onLogOut}
            type="button"
            aria-label="Logout"
          >
            <FaSignOutAlt size="28px" />
          </button>
        </div>
      </div>
    </>
  )
}

export default withRouter(Header)
