<template>
<div class="box is-fullwidth">
  <section class="hero is-primary">
    <div class="hero-body has-text-centered">
      <h1 class="title">
        {{project.name}} Actors
      </h1>
      <h2 class="subtitle">
        The actors registered to this project, and their roles within it
      </h2>
    </div>
  </section>
  <br/>
  <table class="table">
    <thead>
      <tr class="subtitle">
        <td></td>
        <td>Name</td>
        <td>Role</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="actor in actors">
        <td>
          <button class="button is-danger" v-on:click="removeActor(actor.roleId)">-</button>
        </td>
        <td>
          {{actor.actor.fullname}}
        </td>
        <td>
          <select v-model="actor.role" @change="changeActorRole(actor.roleId, $event)">
            <option v-bind:value="'Admin'">
              Admin
            </option>
            <option v-bind:value="'User'">
              User
            </option>
          </select>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="actor-add" v-show="isAddingActor">
    <hr/>
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
  <hr/>
  <router-link class="button" :to='"/projects/"+$route.params.id'>Back</router-link>
  <button class="button" v-show="!isAddingActor" v-on:click="isAddingActor = !isAddingActor">Add Actor</button>
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
      this.updateActors()
    },
    data () {
      return {
        project: {},
        roles: [],
        actors: [],
        isAddingActor: false,
        actorDoesNotExistError: false,
        actorName: ''
      }
    },
    methods: {
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
