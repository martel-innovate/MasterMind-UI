<template>
  <div class="section is-fullwidth">
    <p>
      <button class="button is-primary is-large is-outlined is-fullwidth" v-on:click="login">Login</button>
    </p>
    <p>
      <button class="button is-primary is-large is-outlined is-fullwidth" v-on:click="logout">Logout</button>
    </p>
  </div>
</template>

<script type = "text/javascript" >
  import auth from '../auth'
  export default {
    name: 'login',
    methods: {
      login: function (event) {
        auth.login()
        alert('Logged in')
      },
      logout: function (event) {
        auth.logout()
        alert('Logged out')
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
