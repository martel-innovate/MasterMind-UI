<template>
  <div class="section is-fullwidth">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{cluster.name}}
          </h1>
          <h2 class="subtitle">
            {{cluster.endpoint}}
          </h2>
        </div>
      </div>
    </section>
    <div class="box is-fullwidth">
      <p>
        Description: {{cluster.description}}
      </p>
    </div>
    <div class="panel-block">
      <router-link class="button" :to='"/projects/"+this.$route.params.project_id+"/clusters/"+cluster.id+"/edit"'>Edit Cluster</router-link>
      <button v-on:click="deleteCluster" class="button is-danger">Delete</button>
    </div>
    <div class="panel-block">
       <router-link class="button" :to='"/projects/"+this.$route.params.project_id'>Back</router-link>
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
