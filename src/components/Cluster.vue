<template>
  <div class="box is-fullwidth">
    <section class="hero is-primary">
      <div class="hero-body has-text-centered">
        <div class="container">
          <h1 class="title is-2">
            {{cluster.name}}
          </h1>
          <h2 class="subtitle is-4">
            {{cluster.endpoint}}
          </h2>
        </div>
      </div>
    </section>
    <hr/>
    <p class="title">
      Description
    </p>
    <p class="subtitle">
      {{cluster.description}}
    </p>
    <hr/>
    <p class="title">
      Current state of the Cluster
    </p>
    <div v-if="status">
      <label>Managers</label>
      <div class="box" v-for="manager in status.managers">
        <p v-for="(item, key, index) in manager"><b>{{ key }}</b>: {{ item }}</p>
      </div>
      <label>Workers</label>
      <div class="box" v-for="worker in status.workers">
        <p v-for="(item, key, index) in worker"><b>{{ key }}</b>: {{ item }}</p>
      </div>
    </div>
    <div v-if="!status">
      No response from the Cluster...
    </div>
    <hr/>
    <button v-on:click="getCluster" class="button is-medium">Refresh</button>
    <hr/>
    <!-- TODO: More info on cluster status, networks... -->
    <div class="buttons">
      <router-link class="button is-medium" :to='"/projects/"+this.$route.params.project_id+"/clusters"'>Back</router-link>
      <router-link class="button is-medium" :to='"/projects/"+this.$route.params.project_id+"/clusters/"+cluster.id+"/edit"'>Edit Cluster</router-link>
      <button v-on:click="deleteCluster" class="button is-medium is-danger">Delete Cluster</button>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  export default {
    created () {
      // Retrieve data of this cluster
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/clusters/' + this.$route.params.cluster_id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.cluster = response.data
        this.getCluster()
      })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        cluster: {},
        status: null
      }
    },
    methods: {
      // Method to delete this cluster
      deleteCluster: function () {
        // Setting there variables outside of axios function or else they can't be found
        var projectId = this.$route.params.project_id
        var clusterId = this.$route.params.cluster_id
        // Confirmation dialog
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
            router.push('/projects/' + projectId + '/clusters')
          })
          .catch(function (error) {
            console.log(error)
            alert(error)
          })
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      // Get Status of the Swarm Cluster
      getCluster: function () {
        var projectId = this.$route.params.project_id
        var clusterId = this.$route.params.cluster_id
        axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters/' + clusterId + '/getclusterinfo', {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          console.log(response.data)
          // TODO: Better format and display this
          this.status = JSON.parse(response.data.swarm_status.replace(/'/g, '"'))
        })
        .catch(error => {
          console.log(error)
          // TODO: Better format and display this
          this.status = null
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
