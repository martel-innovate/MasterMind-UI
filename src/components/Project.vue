<template>
<!--new style start-->
<div class="section is-fullwidth">
  <section class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          {{project.name}}
        </h1>
        <h2 class="subtitle">
          {{project.description}}
        </h2>
      </div>
    </div>
  </section>
  <br/>
  <div class="box is-fullwidth">
    <h2 class="notification is-info">Registered Clusters:</h2>
    <div class="box is-fullwidth">
      <ul>
        <li v-for="cluster in clusters">
          <router-link :to='"/projects/"+project.id+"/clusters/"+cluster.id'>{{cluster.name}}</router-link>
        </li>
      </ul>
    </div>
    <router-link class="button" :to='"/projects/"+project.id+"/clusters/new"'>Register Cluster</router-link>
  </div>
  <div class="box is-fullwidth">
    <h2 class="notification is-info">Registered Services:</h2>
    <div class="box is-fullwidth">
      <ul>
        <li v-for="service in services">
          <router-link :to='"/projects/"+project.id+"/services/"+service.id'>{{service.name}}</router-link>
        </li>
      </ul>
    </div>
    <router-link class="button" :to='"/projects/"+project.id+"/services/new"'>Register Service</router-link>
  </div>
  <div class="box is-fullwidth">
    <h2 class="notification is-info">Registered Subscriptions:</h2>
    <div class="box is-fullwidth">
      <ul>
        <li v-for="subscription in subscriptions">
          <router-link :to='"/projects/"+project.id+"/subscriptions/"+subscription.id'>{{subscription.name}}</router-link>
        </li>
      </ul>
    </div>
    <router-link class="button" :to='"/projects/"+project.id+"/subscriptions/new"'>Register Subscription</router-link>
  </div>
  <div class="box is-fullwidth">
    <h2 class="notification is-info">Registered Actors:</h2>
    <div class="box is-fullwidth">
      <p v-for="actor in actors">
        <button class="button is-danger" v-on:click="removeActor(actor.roleId)">-</button>
        {{actor.actor.fullname}}:
        <select v-model="actor.role" @change="changeActorRole(actor.roleId, $event)">
          <option v-bind:value="'Admin'">
            Admin
          </option>
          <option v-bind:value="'User'">
            User
          </option>
        </select>
      </p>
    </div>
    <button class="button" v-show="!isAddingActor" v-on:click="showAddActor">Add Actor</button>
    <div class="actor-add" v-show="isAddingActor">
      <form id="actor">
        <p>
          Full Name: <input type="text" v-model="actorName">
          <button v-on:click="addActor">Add</button>
        </p>
        <div v-show="actorDoesNotExistError" class="notification is-danger">
          Actor does not exist...
        </div>
      </form>
    </div>
  </div>
  <router-link class="button" :to='"/projects/"+project.id+"/edit"'>Edit Project</router-link>
  <hr/>
  <a href="#" v-on:click="deleteProject" class="button is-danger">Delete project</a>
  <hr/>
  <router-link class="button" :to='"/"'>Back</router-link>
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
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/ngsi_subscriptions', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.subscriptions = response.data })
      .catch(error => { console.log(error) })
      this.updateActors()
    },
    data () {
      return {
        project: {},
        clusters: [],
        services: [],
        subscriptions: [],
        roles: [],
        actors: [],
        isAddingActor: false,
        actorDoesNotExistError: false,
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
      changeActorRole: function (roleId, event) {
        var projectId = this.$route.params.id
        var role = 0
        if (event.target.value === 'Admin') {
          role = 1
        }
        if (event.target.value === 'User') {
          role = 2
        }
        if (role === 0) {
          console.log('Unable to select role')
          return
        }
        axios({
          method: 'put',
          url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/roles/' + roleId,
          headers: { 'Authorization': auth.getAuthHeader() },
          data: {
            role_level_id: role
          }
        })
        .then(function (response) {
          console.log(response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      showAddActor: function (event) {
        this.isAddingActor = true
      },
      addActor: function (event) {
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
            this.isAddingActor = false
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
          } else {
            this.actorDoesNotExistError = true
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
