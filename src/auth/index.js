const API_URL = process.env.API_URL

export default {

  user: {
    authenticated: false
  },

  login (token) {
    console.log('Env: ' + process.env.API_URL)
    localStorage.setItem('api_token', token)
    var d = new Date()
    d.setDate(d.getDate() + 1)
    localStorage.setItem('api_token_expires', d)
    this.user.authenticated = true
  },

  logout () {
    localStorage.removeItem('api_token')
    localStorage.removeItem('api_token_expires')
    this.user.authenticated = false
  },

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

  getAuthHeader () {
    return localStorage.getItem('api_token')
  },

  getAPIUrl () {
    return API_URL
  }
}
