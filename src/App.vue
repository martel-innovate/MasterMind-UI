<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>
      <router-link to="/projects"><b>Projects</b></router-link>
      -
      <router-link to="/login"><b>Login</b></router-link>
    </div>
  <hr/>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
