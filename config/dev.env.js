var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MASTERMIND_API_URI: process.env.MASTERMIND_API_URI || '"http://localhost:3000/"'
})
