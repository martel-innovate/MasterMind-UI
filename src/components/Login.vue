<template>
  <div class="section is-fullwidth">
    <!-- Check if logged in and display correct button -->
    <p v-if="!logged">
      <!-- Redirect to Fiware Lab to authenticate -->
      <a :href=loginURI class="button is-primary is-large is-outlined is-fullwidth">Login via Fiware</a>
    </p>
    <p v-if="logged" >
      <button class="button is-primary is-large is-outlined is-fullwidth" v-on:click="logout">Logout</button>
    </p>
  </div>
</template>

<script type = "text/javascript" >
  import auth from '../auth'
  import router from '../router'
  export default {
    name: 'login',
    // If token is in the query, redirect to root of MasterMind
    created () {
      let token = this.$route.query.token
      if (token) {
        auth.login(token)
        this.logged = true
        router.push('/')
      }
      this.loginURI = this.constructLoginURI()
    },
    // Check if logged in
    data () {
      return {
        logged: auth.checkAuth(),
        loginURI: ''
      }
    },
    methods: {
      // Log out and reload the page
      logout: function (event) {
        auth.logout()
        this.logged = false
        location.reload()
      },
      // Construct the URI for the Oauth authentication
      constructLoginURI: function () {
        var uri = ''
        uri += 'https://'
        uri += process.env.MASTERMIND_OAUTH_URI
        uri += '/oauth2/authorize'
        uri += '?'
        uri += 'response_type=code'
        uri += '&'
        uri += 'client_id='
        uri += process.env.MASTERMIND_OAUTH_CLIENT_ID
        uri += '&'
        uri += 'state=xyz'
        uri += '&'
        uri += 'redirect_uri='
        uri += 'http://'
        uri += process.env.MASTERMIND_API_HOST
        uri += ':'
        uri += process.env.MASTERMIND_API_PORT
        uri += '/auth/login'
        return encodeURI(uri)
      }
    }
  }
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
