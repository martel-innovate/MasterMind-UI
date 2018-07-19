<template>
<div class="box is-fullwidth">
  <section class="hero is-primary">
    <div class="hero-body has-text-centered">
      <h1 class="title is-2">
        {{project.name}} Clusters
      </h1>
      <h2 class="subtitle is-4">
        The clusters registered to deploy services on
      </h2>
    </div>
  </section>
  <br/>
  <div>
    <router-link :to='"/"'>Projects</router-link>
    /
    <router-link :to='"/projects/"+$route.params.id'>{{project.name}}</router-link>
    /
    Clusters
    <!-- Search box to filter clusters list -->
    <input class="is-pulled-right" v-model="searchQuery" placeholder="Search...">
  </div>
  <hr/>
  <table class="table">
    <thead>
      <tr class="subtitle">
        <td>Name</td>
        <td>Endpoint</td>
        <td>Actions</td>
      </tr>
    </thead>
    <tbody>
      <!-- List all the clusters using filterClusters to filter by the search query -->
      <tr v-for="cluster in filterClusters(clusters, searchQuery)">
        <td>
          <router-link :to='"/projects/"+$route.params.id+"/clusters/"+cluster.id'>{{cluster.name}}</router-link>
        </td>
        <td>
          {{cluster.endpoint}}
        </td>
        <!-- Actions on the clusters (details, edit, delete) -->
        <td>
          <span class="button is-large" v-on:click='clusterDetails(cluster.id)' v-tooltip="'View Cluster details'">
            <i class="fa fa-eye"></i>
          </span>
          &nbsp
          <span class="button is-large" v-on:click='editCluster(cluster.id)' v-tooltip="'Edit Cluster'">
            <i class="fa fa-edit"></i>
          </span>
          &nbsp
          <span class="button is-large is-danger" v-on:click='deleteCluster(cluster.id)' v-tooltip="'Delete Cluster'">
            <i class="fa fa-trash"></i>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
  <hr/>
  <router-link class="button is-medium is-primary" :to='"/projects/"+$route.params.id+"/clusters/new"'>Register Cluster</router-link>
</div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  export default {
    created () {
      // Retrieve project, and the list of clusters for it
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
      // Filter clusters list by search query (cluster names)
      filterClusters: function (clusters, searchQuery) {
        return clusters.filter(function (cluster) {
          return cluster.name.includes(searchQuery)
        })
      },
      // Route to the details of selected cluster
      clusterDetails: function (clusterId) {
        router.push('/projects/' + this.$route.params.id + '/clusters/' + clusterId)
      },
      // Route to edit page of selected cluster
      editCluster: function (clusterId) {
        router.push('/projects/' + this.$route.params.id + '/clusters/' + clusterId + '/edit')
      },
      // Delete selected cluster
      deleteCluster: function (clusterId) {
        // Setting this outside of axios function
        var projectId = this.$route.params.id
        this.$dialog.confirm('Are you sure you want to delete the Cluster?', {okText: 'DELETE', cancelText: 'CANCEL'})
        .then(function () {
          // Sending delete to API
          axios({
            method: 'delete',
            url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters/' + clusterId,
            headers: { 'Authorization': auth.getAuthHeader() }
          })
          .then(function (response) {
            console.log(response.data)
            location.reload()
          })
          .catch(function (error) {
            console.log(error)
            alert(error)
          })
        })
        .catch(function (error) {
          console.log(error)
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
