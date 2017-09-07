<template>
  <div class="login">
    <button v-on:click="login">Login</button>
    <button v-on:click="logout">Logout</button>
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
