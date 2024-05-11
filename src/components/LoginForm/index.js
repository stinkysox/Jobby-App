import Cookies from 'js-cookie'
import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', errorMsg: '', showError: false}

  onRequestSuccess = token => {
    const {history} = this.props

    Cookies.set('jwt_token', token, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onRequestFail = error => {
    this.setState({
      errorMsg: error,
      showError: true,
      username: '',
      password: '',
    })
  }

  onFormValidate = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userdetails = {username, password}

    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userdetails),
    }

    const reponse = await fetch(apiUrl, options)
    const data = await reponse.json()

    if (reponse.ok === true) {
      this.onRequestSuccess(data.jwt_token)
    } else {
      this.onRequestFail(data.error_msg)
    }

    this.setState({username: '', password: ''})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {showError, errorMsg} = this.state
    const jtwToken = Cookies.get('jwt_token')
    if (jtwToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <div className="login-container">
          <form className="form-container" onSubmit={this.onFormValidate}>
            <div className="logo-container">
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
                className="website-logo"
              />
            </div>
            <div className="username-container">
              <label htmlFor="username" className="label">
                USERNAME
              </label>
              <br />
              <input
                type="text"
                id="username"
                className="input-el"
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="username-container">
              <label htmlFor="password" className="label">
                PASSWORD
              </label>
              <br />
              <input
                type="password"
                id="password"
                className="input-el"
                onChange={this.onChangePassword}
              />
            </div>
            <p className="error-text">{showError ? errorMsg : ''}</p>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
