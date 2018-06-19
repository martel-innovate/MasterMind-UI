var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MASTERMIND_API_HOST: process.env.MASTERMIND_API_HOST || '"localhost"',
  MASTERMIND_API_PORT: process.env.MASTERMIND_API_PORT || '"3000"',
  MASTERMIND_OAUTH_URI: process.env.MASTERMIND_OAUTH_URI || '"account.lab.fiware.org"',
  MASTERMIND_OAUTH_CLIENT_ID: process.env.MASTERMIND_OAUTH_CLIENT_ID || '"cb19b84cbc654af2bdedaab30dc49f38"',
  MASTERMIND_OAUTH_REDIRECT_URI: process.env.MASTERMIND_OAUTH_REDIRECT_URI || '"http://localhost:3000/auth/login"'
})
