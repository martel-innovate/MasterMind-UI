<template>
  <div class="cluster">
    <div class="cluster-details">
      <h1>Cluster Details:</h1>
      <ul>
        <li>
          <b>{{cluster.name}}</b>:
        </li>
        <li>
          Description: {{cluster.description}}
        </li>
        <li>
          Endpoint: {{cluster.endpoint}}
        </li>
      </ul>
    </div>
    <hr/>
    <div class="edit-cluster">
      <router-link :to='"/projects/"+this.$route.params.project_id+"/clusters/"+cluster.id+"/edit"'>Edit Cluster</router-link>
    </div>
    <hr/>
    <div class="delete-cluster">
      <button v-on:click="deleteCluster"><b>DELETE CLUSTER</b></button>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  export default {
    name: 'project',
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/clusters/' + this.$route.params.cluster_id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.cluster = response.data })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        cluster: {}
      }
    },
    methods: {
      deleteCluster: function (event) {
        var projectId = this.$route.params.project_id
        axios({
          method: 'delete',
          url: auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/clusters/' + this.$route.params.cluster_id,
          headers: { 'Authorization': auth.getAuthHeader() }
        })
        .then(function (response) {
          console.log(response.data)
          router.push('/projects/' + projectId)
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
