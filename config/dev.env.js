var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MASTERMIND_API_HOST: process.env.MASTERMIND_API_HOST || '"localhost"',
  MASTERMIND_API_PORT: process.env.MASTERMIND_API_PORT || '"3000"'
})
