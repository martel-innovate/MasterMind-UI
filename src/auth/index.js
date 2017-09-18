import axios from 'axios'

const API_URL = process.env.API_URL
const LOGIN_URL = API_URL + 'auth/login'

export default {

  user: {
    authenticated: false
  },

  login (context, creds, redirect) {
    console.log('Env: ' + process.env.API_URL)
    axios.get(LOGIN_URL)
    .then(response => {
      localStorage.setItem('api_token', response.data.auth_token)
      this.user.authenticated = true
    })
    .catch(error => { console.log(error) })
  },

  logout () {
    localStorage.removeItem('api_token')
    this.user.authenticated = false
  },

  checkAuth () {
    if (localStorage.getItem('api_token')) {
      this.user.authenticated = true
    } else {
      this.user.authenticated = false
    }
  },

  getAuthHeader () {
    return localStorage.getItem('api_token')
  },

  getAPIUrl () {
    return API_URL
  }
}
