<template>
  <div id="app" class="columns">
    <aside class="column is-2 aside hero is-fullheight is-hidden-mobile">
      <div>
        <div class="main">
          <div class="title">MASTERMIND</div>
          <br/>
          <router-link v-if="!actorIsAuthenticated()" class="item" to="/login"><span class="name">Login</span></router-link>
          <router-link v-if="actorIsAuthenticated()" class="item" to="/login"><span class="name">Logout</span></router-link>
          <hr v-if="actorIsAuthenticated()"/>
          <router-link v-if="actorIsAuthenticated()" class="item" to="/projects"><span class="name">Projects</span></router-link>
          <router-link v-if="actorIsAuthenticated()" class="item" to="/catalog"><span class="name">Service Catalog</span></router-link>
        </div>
      </div>
    </aside>
    <div class="column is-10 admin-panel">
      <nav class="nav has-shadow" id="top">
        <div class="container">
          <div class="nav-left"></div>
          <span class="nav-toggle">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
      </nav>
      <div class="columns is-mobile">
        <div class="column is-10 is-offset-1">
          <br/>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from './auth'
export default {
  name: 'app',
  methods: {
    actorIsAuthenticated: function () {
      return auth.checkAuth()
    }
  }
}
</script>
