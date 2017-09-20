<template>
 <div id="app"  class="columns">
   <aside class="column is-3 aside hero is-fullheight is-hidden-mobile">
      <div>
         <div class="main">
            <div class="title">MasterMind Dashboard</div>
         <ul class="menu-list">
            <li>
              <a class="is-active">Projects</a>
                  <ul>
                    <li> <router-link class="item" to="/projects">
                  <span class="icon">
                    <i class="fa fa-map-marker"></i>
                  </span>
                  <span class="name">Project list</span>
                </router-link>
                    </li>
                    <li> <router-link class="item" to="/projects/new">
                  <span class="icon">
                    <i class="fa fa-map-marker"></i>
                  </span>
                  <span class="name">New Project</span>
                </router-link>
                    </li>
                  </ul>
            </li>
          </ul>
           
            <router-link class="item" to="/login"><span class="icon"><i class="fa fa-map-marker"></i></span><span class="name">Login</span></router-link>
            <a href="#" class="item"><span class="icon"><i class="fa fa-th-list"></i></span><span class="name">Timeline</span></a>
            <a href="#" class="item"><span class="icon"><i class="fa fa-folder-o"></i></span><span class="name">Folders</span></a>
         </div>
      </div>
   </aside>
   <div class="column is-10 admin-panel">
      <nav class="nav has-shadow" id="top">
         <div class="container">
            <div class="nav-left">
            </div>
            <span class="nav-toggle">
            <span></span>
            <span></span>
            <span></span>
            </span>
         </div>
      </nav>
      <section class="hero is-small">
         <!-- Hero content: will be in the middle -->
         <div class="hero-body">
            <div class="container">
               <h1 class="title">
                  MasterMind
               </h1>
               <h2 class="subtitle">
                  
               </h2>
            </div>
         </div>
         <!-- Hero footer: will stick at the bottom -->
         <div class="hero-foot">
            <nav class="level">
               <div class="level-item has-text-centered">
               </div>
               <div class="level-item has-text-centered">
               </div>
               <div class="level-item has-text-centered">
               </div>
               <div class="level-item has-text-centered">
               </div>
            </nav>
         </div>
      </section>
      <div class="columns is-mobile">
         <div class="column is-half is-offset-2">
            <router-view></router-view>
         </div>
         </section>
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