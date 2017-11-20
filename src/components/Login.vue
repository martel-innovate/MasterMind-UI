<template>
  <div class="section is-fullwidth">
    <p v-if="!logged">
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
  export default {
    name: 'login',
    created () {
      let token = this.$route.query.token
      if (token) {
        auth.login(token)
        this.logged = true
      }
    },
    data () {
      return {
        logged: auth.checkAuth()
      }
    },
    methods: {
      logout: function (event) {
        auth.logout()
        this.logged = false
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
