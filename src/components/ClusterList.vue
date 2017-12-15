<template>
<div class="box is-fullwidth">
  <section class="hero is-primary">
    <div class="hero-body has-text-centered">
      <h1 class="title">
        {{project.name}} Clusters
      </h1>
      <h2 class="subtitle">
        The clusters registered to deploy services on
      </h2>
    </div>
  </section>
  <br/>
  <router-link class="button" :to='"/projects/"+$route.params.id'>Back</router-link>
  <input class="is-pulled-right" v-model="searchQuery" placeholder="Search...">
  <hr/>
  <table class="table">
    <thead>
      <tr class="subtitle">
        <td>Name</td>
        <td>Endpoint</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="cluster in filterClusters(clusters, searchQuery)">
        <td>
          <router-link :to='"/projects/"+$route.params.id+"/clusters/"+cluster.id'>{{cluster.name}}</router-link>
        </td>
        <td>
          {{cluster.endpoint}}
        </td>
      </tr>
    </tbody>
  </table>
  <hr/>
  <router-link class="button is-primary" :to='"/projects/"+$route.params.id+"/clusters/new"'>Register Cluster</router-link>
</div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  export default {
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.project = response.data })
      .catch(error => { console.log(error) })
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/clusters', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.clusters = response.data })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        project: {},
        clusters: [],
        searchQuery: ''
      }
    },
    methods: {
      filterClusters: function (clusters, searchQuery) {
        return clusters.filter(function (cluster) {
          return cluster.name.includes(searchQuery)
        })
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
