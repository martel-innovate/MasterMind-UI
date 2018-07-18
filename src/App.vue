<template>
  <div id="main" class="columns">
    <aside id="sidebar" class="column is-2">
      <div id="mastermind-title" class="title is-centered">
        <h2><router-link class="item" to="/"><span class="name">MASTERMIND</span></router-link></h2>
      </div>
      <hr/>
      <ul id="side-menu" class="is-centered">
        <li>
          <Login></Login>
        </li>
        <li v-if="actorIsAuthenticated()">
          <h4><router-link class="item" to="/projects"><span class="name button is-medium is-fullwidth">Projects</span></router-link></h4>
        </li>
        <li v-if="actorIsAuthenticated()">
          <h4><router-link class="item" to="/catalog"><span class="name button is-medium is-fullwidth">Service Catalog</span></router-link></h4>
        </li>
      </ul>
    </aside>
    <div id="main-body" class="column is-10">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import auth from './auth'
import Login from '@/components/Login.vue'
export default {
  // Main app of Vue
  name: 'app',
  components: {
    Login
  },
  methods: {
    actorIsAuthenticated: function () {
      return auth.checkAuth()
    }
  }
}
</script>

<style scoped>
  #side-menu {
    text-align: center;
  }
  #mastermind-title {
    text-align: center;
  }
</style>
