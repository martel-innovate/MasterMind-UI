<template>
  <div class="project">
    <div class="project-details">
      <h1>Project Details:</h1>
      <ul>
        <li>
          <b>{{project.name}}</b>:
        </li>
        <li>
          {{project.description}}
        </li>
      </ul>
    </div>
    <div class="cluster-list">
      <h1>Registered Clusters:</h1>
      <ul>
        <li v-for="cluster in clusters">
          <router-link :to='"/projects/"+project.id+"/clusters/"+cluster.id'>{{cluster.name}}</router-link>
        </li>
      </ul>
      <router-link :to='"/projects/"+project.id+"/clusters/new"'>Register Cluster</router-link>
    </div>
    <div class="services-list">
      <h1>Registered Services:</h1>
      <ul>
        <li v-for="service in services">
          {{service.endpoint}}
        </li>
      </ul>
    </div>
    <div class="services-list">
      <h1>Registered Roles:</h1>
      <ul>
        <li v-for="actor in actors">
          {{actor.fullname}}
        </li>
      </ul>
    </div>
    <hr/>
    <div class="edit-project">
      <router-link :to='"/projects/"+project.id+"/edit"'>Edit Project</router-link>
    </div>
    <hr/>
    <div class="delete-project">
      <button v-on:click="deleteProject"><b>DELETE PROJECT</b></button>
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
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.project = response.data })
      .catch(error => { console.log(error) })
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/clusters', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.clusters = response.data })
      .catch(error => { console.log(error) })
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/services', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.services = response.data })
      .catch(error => { console.log(error) })
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/roles', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.roles = response.data
        var actors = []
        var promises = []
        this.roles.forEach(function (element) {
          promises.push(axios.get(auth.getAPIUrl() + 'v1/actors/' + element.actor_id, {headers: {'Authorization': auth.getAuthHeader()}})
          .then(response => { actors.push(response.data) })
          .catch(error => { console.log(error) }))
        })
        axios.all(promises).then(response => { this.actors = actors }).catch(error => { console.log(error) })
      })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        project: {},
        clusters: [],
        services: [],
        roles: [],
        actors: []
      }
    },
    methods: {
      deleteProject: function (event) {
        axios({
          method: 'delete',
          url: auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id,
          headers: { 'Authorization': auth.getAuthHeader() }
        })
        .then(function (response) {
          console.log(response.data)
          router.push('/projects')
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
