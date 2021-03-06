<template>
<div class="box is-fullwidth">
  <section class="hero is-primary">
    <div class="hero-body has-text-centered">
      <h1 class="title is-2">
        {{project.name}} Actors
      </h1>
      <h2 class="subtitle is-4">
        The actors registered to this project, and their roles within it
      </h2>
    </div>
  </section>
  <br/>
  <div>
    <router-link :to='"/"'>Projects</router-link>
    /
    <router-link :to='"/projects/"+$route.params.id'>{{project.name}}</router-link>
    /
    Actors
  </div>
  <hr/>
  <table class="table">
    <thead>
      <tr class="subtitle">
        <td></td>
        <td>Name</td>
        <td>Role</td>
        <td>Permissions</td>
      </tr>
    </thead>
    <tbody>
      <!-- Display list of actors -->
      <tr v-for="actor in actors">
        <td>
          <button class="button is-danger" v-on:click="removeActor(actor.roleId)">-</button>
        </td>
        <td>
          {{actor.actor.fullname}}
        </td>
        <td>
          <!-- Change role of this actor, react on change event for dropdown menu -->
          <select v-model="actor.role" @change="changeActorRole(actor.roleId, $event)">
            <option v-bind:value="'Admin'">
              Admin
            </option>
            <option v-bind:value="'User'">
              User
            </option>
          </select>
        </td>
        <td>
          <label>Clusters:</label>
          <select v-model="actor.clusters_permissions" @change="changeActorPermissions(actor.roleId, 'clusters', $event)">
            <option v-bind:value="'false'">
              Read
            </option>
            <option v-bind:value="'true'">
              Edit
            </option>
          </select>
          <label>Services:</label>
          <select v-model="actor.services_permissions" @change="changeActorPermissions(actor.roleId, 'services', $event)">
            <option v-bind:value="'false'">
              Read
            </option>
            <option v-bind:value="'true'">
              Edit
            </option>
          </select>
          <label>Subscriptions:</label>
          <select v-model="actor.subscriptions_permissions" @change="changeActorPermissions(actor.roleId, 'subscriptions', $event)">
            <option v-bind:value="'false'">
              Read
            </option>
            <option v-bind:value="'true'">
              Edit
            </option>
          </select>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- Adding actor form, shown if attempt to add actor -->
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
  <!-- Add actor button -->
  <button class="button is-medium" v-show="!isAddingActor" v-on:click="isAddingActor = !isAddingActor">Add Actor</button>
</div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  export default {
    created () {
      // Get list of actors from API
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
      // Update actors being listed
      updateActors: function (event) {
        // Get actor roles
        var projectId = this.$route.params.id
        axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/roles', {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          this.roles = response.data
          var actors = []
          var promises = []
          // Get role levels of the actors, save them in data
          this.roles.forEach(function (role) {
            // Push promise to a list
            promises.push(axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/getactorbyrole?role_id=' + role.id, {headers: {'Authorization': auth.getAuthHeader()}})
            .then(response => {
              if (role.role_level_id === 1) {
                actors.push({actor: response.data, role: 'Admin', roleId: role.id, clusters_permissions: role.clusters_permissions, services_permissions: role.services_permissions, subscriptions_permissions: role.subscriptions_permissions})
              }
              if (role.role_level_id === 2) {
                actors.push({actor: response.data, role: 'User', roleId: role.id, clusters_permissions: role.clusters_permissions, services_permissions: role.services_permissions, subscriptions_permissions: role.subscriptions_permissions})
              }
            })
            .catch(error => { console.log(error) }))
          })
          // Wait for all promises to resolve
          axios.all(promises).then(response => {
            this.actors = actors
            console.log(actors)
          })
          .catch(error => {
            console.log(error)
          })
          this.actors.sort(function (a, b) {
            if (a.role.fullname < b.role.fullname) return -1
            if (a.role.fullname > b.role.fullname) return 1
            return 0
          })
        })
        .catch(error => { console.log(error) })
      },
      // Change the role of an actor
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
        // PUT action to the API
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
      // Change the role of an actor
      changeActorPermissions: function (roleId, permissionKind, event) {
        var projectId = this.$route.params.id
        console.log(permissionKind)
        var permission = event.target.value
        var data = {}
        if (permissionKind === 'clusters') {
          data = {
            clusters_permissions: permission
          }
        } else if (permissionKind === 'services') {
          data = {
            services_permissions: permission
          }
        } else if (permissionKind === 'subscriptions') {
          data = {
            subscriptions_permissions: permission
          }
        }
        // PUT action to the API
        axios({
          method: 'put',
          url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/roles/' + roleId,
          headers: { 'Authorization': auth.getAuthHeader() },
          data: data
        })
        .then(function (response) {
          console.log(response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      // Shows the form to add an actor
      showAddActor: function (event) {
        this.isAddingActor = true
      },
      // Adds a new actor and role to the project
      addActor: function (event) {
        var actorName = this.actorName
        var projectId = this.$route.params.id
        console.log(actorName)
        // Get actors again from API
        axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/registerfullname?fullname=' + actorName, {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          location.reload()
        })
        .catch(error => {
          console.log(error)
          this.actorDoesNotExistError = true
        })
      },
      // Remove actor from project (delete its role within it)
      removeActor: function (roleId) {
        var projectId = this.$route.params.id
        var updateActors = this.updateActors
        this.$dialog.confirm('Are you sure you want to delete the Actor?', {okText: 'DELETE', cancelText: 'CANCEL'})
        .then(function () {
          // Delete role corresponding to actor and project
          axios({
            method: 'delete',
            url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/roles/' + roleId,
            headers: { 'Authorization': auth.getAuthHeader() }
          })
          .then(function (response) {
            console.log(response.data)
            updateActors()
          })
          .catch(function (error) {
            console.log(error)
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
