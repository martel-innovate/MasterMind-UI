<template>
<div class="box is-fullwidth">
  <section class="hero is-primary">
    <div class="hero-body has-text-centered">
      <h1 class="title">
        Registered Clusters
      </h1>
      <h2 class="subtitle">
        The clusters registered to deploy services on
      </h2>
    </div>
  </section>
  <br/>
  <div>
    <ul>
      <li v-for="cluster in clusters">
        <router-link class="button is-primary is-large is-outlined is-fullwidth" :to='"/projects/"+$route.params.id+"/clusters/"+cluster.id'>{{cluster.name}}</router-link>
        <br/>
      </li>
    </ul>
  </div>
  <hr/>
  <router-link class="button" :to='"/projects/"+$route.params.id'>Back</router-link>
  <router-link class="button" :to='"/projects/"+$route.params.id+"/clusters/new"'>Register Cluster</router-link>
</div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  export default {
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/clusters', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.clusters = response.data })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        clusters: []
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
