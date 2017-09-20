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
          <router-link :to='"/projects/"+project.id+"/services/"+service.id'>{{service.name}}</router-link>
        </li>
      </ul>
      <router-link :to='"/projects/"+project.id+"/services/new"'>Register Service</router-link>
    </div>
    <div class="actors-list">
      <h1>Registered Actors:</h1>
      <ul>
        <li v-for="actor in actors">
          {{actor.actor.fullname}}: {{actor.role}} <button v-on:click="removeActor(actor.roleId)">-</button>
        </li>
      </ul>
      <button v-show="!isAddingActor" v-on:click="showAddActor">Add Actor</button>
      <div class="actor-add" v-show="isAddingActor">
        <form id="actor">
          <p>
            Full Name: <input type="text" v-model="actorName">
            <button v-on:click="addActor">Add</button>
          </p>
        </form>
      </div>
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
      this.updateActors()
    },
    data () {
      return {
        project: {},
        clusters: [],
        services: [],
        roles: [],
        actors: [],
        isAddingActor: false,
        actorName: ''
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
      },
      updateActors: function (event) {
        axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/roles', {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          this.roles = response.data
          var actors = []
          var promises = []
          this.roles.forEach(function (role) {
            promises.push(axios.get(auth.getAPIUrl() + 'v1/actors/' + role.actor_id, {headers: {'Authorization': auth.getAuthHeader()}})
            .then(response => {
              if (role.role_level_id === 1) {
                actors.push({actor: response.data, role: 'Admin', roleId: role.id})
              }
              if (role.role_level_id === 2) {
                actors.push({actor: response.data, role: 'User', roleId: role.id})
              }
            })
            .catch(error => { console.log(error) }))
          })
          axios.all(promises).then(response => { this.actors = actors }).catch(error => { console.log(error) })
        })
        .catch(error => { console.log(error) })
      },
      showAddActor: function (event) {
        this.isAddingActor = true
      },
      addActor: function (event) {
        this.isAddingActor = false
        var actorName = this.actorName
        var projectId = this.$route.params.id
        var updateActors = this.updateActors
        axios.get(auth.getAPIUrl() + 'v1/actors', {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          var actors = response.data
          var actorId = ''
          actors.forEach(function (actor) {
            if (actor.fullname === actorName) {
              actorId = actor.id
            }
          })
          if (actorId !== '') {
            axios({
              method: 'post',
              url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/roles',
              headers: { 'Authorization': auth.getAuthHeader() },
              data: {
                actor_id: actorId,
                role_level_id: 2,
                project_id: projectId
              }
            })
            .then(function (response) {
              console.log(response.data)
              updateActors()
            })
            .catch(function (error) {
              console.log(error)
            })
          }
        })
        .catch(error => { console.log(error) })
      },
      removeActor: function (roleId) {
        var updateActors = this.updateActors
        axios({
          method: 'delete',
          url: auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/roles/' + roleId,
          headers: { 'Authorization': auth.getAuthHeader() }
        })
        .then(function (response) {
          console.log(response.data)
          updateActors()
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
