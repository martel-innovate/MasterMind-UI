// Setting URI for MasterMind API
const MASTERMIND_API_URI = 'http://' + process.env.MASTERMIND_API_HOST + ':' + process.env.MASTERMIND_API_PORT + '/'

export default {
  // User model for the UI
  user: {
    authenticated: false
  },

  // Login into MasterMind, retrieve API token
  login (token) {
    localStorage.setItem('api_token', token)
    // Set expiration time of otken
    var d = new Date()
    d.setDate(d.getDate() + 1)
    localStorage.setItem('api_token_expires', d)
    this.user.authenticated = true
  },

  // Logout of MasterMind, remove API tokens
  logout () {
    localStorage.removeItem('api_token')
    localStorage.removeItem('api_token_expires')
    this.user.authenticated = false
  },

  // Check if token is not expired
  // TODO: Check for actual validity with API as well
  checkAuth () {
    const currentTime = new Date()
    const expirationTime = new Date(localStorage.getItem('api_token_expires'))
    if (localStorage.getItem('api_token') && expirationTime > currentTime) {
      this.user.authenticated = true
      return true
    } else {
      this.user.authenticated = false
      return false
    }
  },

  // Get API token
  getAuthHeader () {
    return localStorage.getItem('api_token')
  },

  // Get API URI
  getAPIUrl () {
    return MASTERMIND_API_URI
  }
}
