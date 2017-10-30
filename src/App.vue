<template>
  <div id="app" class="columns">
    <aside class="column is-2 aside hero is-fullheight is-hidden-mobile">
      <div>
        <div class="main">
          <div class="title">MasterMind</div>
          <router-link class="item" to="/projects"><span class="name">Projects</span></router-link>
          <router-link class="item" to="/login"><span class="name">Login</span></router-link>
          <router-link class="item" to="/catalog"><span class="name">Service Catalog</span></router-link>
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
export default {
  name: 'app'
}
</script>
