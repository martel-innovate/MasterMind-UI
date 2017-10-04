<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        Cluster Details
      </p>
    </header>
    <div class="card-content">
      <div class="content">
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
    <hr/>
      </div>
    </div>
    <footer class="card-footer">
       <router-link class="card-footer-item" :to='"/projects/"+this.$route.params.project_id+"/clusters/"+cluster.id+"/edit"'>Edit Cluster</router-link>
       <a href="#" v-on:click="deleteCluster" class="card-footer-item">Delete</a>
    </footer>
    <router-link class="button" :to='"/projects/"+this.$route.params.project_id'>Back</router-link>
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
