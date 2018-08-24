module.exports = {
  NODE_ENV: '"production"',
  MASTERMIND_API_HOST: JSON.stringify(process.env.MASTERMIND_API_HOST),
  MASTERMIND_API_PORT: JSON.stringify(process.env.MASTERMIND_API_PORT),
  MASTERMIND_OAUTH_URI: JSON.stringify(process.env.MASTERMIND_OAUTH_URI),
  MASTERMIND_OAUTH_CLIENT_ID: JSON.stringify(process.env.MASTERMIND_OAUTH_CLIENT_ID)
}
