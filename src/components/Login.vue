<template>
  <div class="section is-fullwidth">
    <!-- Check if logged in and display correct button -->
    <p v-if="!logged">
      <!-- Redirect to Fiware Lab to authenticate -->
      <!-- TODO: Move to configuration elsewhere -->
      <a href="https://account.lab.fiware.org/oauth2/authorize?response_type=code&client_id=f856da058c20414db0e946d234a5b9b1&state=xyz&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flogin"
         class="button is-primary is-large is-outlined is-fullwidth" >Login via Fiware</a>
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
    },
    // Check if logged in
    data () {
      return {
        logged: auth.checkAuth()
      }
    },
    methods: {
      // Log out and reload the page
      logout: function (event) {
        auth.logout()
        this.logged = false
        location.reload()
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
