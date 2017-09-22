<template>
<!--new style start-->
<div class="card is-fullwidth">
  <header class="card-header">
    <p class="card-header-title">
      Project Details
    </p>                
  </header>
  <div class="card-content">
    <article class="media">                  
      <div class="media-content">
        <div class="content">
          <p>
            <strong>Project name:</strong> {{project.name}}
            <br>
            <strong>Project description:</strong>
            {{project.description}}
          </p>
        </div>
      </div>
    </article>
  </div>
  <hr>
  <header class="card-header">
    <p class="card-header-title">
      Registered Clusters
    </p>                
  </header>
  <div class="card-content">
    <article class="media">                  
      <div class="media-content">
        <div class="content">
          <p>
            <ul>
              <li v-for="cluster in clusters">
                <router-link :to='"/projects/"+project.id+"/clusters/"+cluster.id'>{{cluster.name}}</router-link>
              </li>  
            </ul>  
          </p>
        </div>
      </div>
    </article>
  </div>
  <hr>
  <header class="card-header">
    <p class="card-header-title">
      Registered Services
    </p>                
  </header>
  <div class="card-content">
    <article class="media">                  
      <div class="media-content">
        <div class="content">
          <p>
            <ul>
              <li v-for="service in services">
                <router-link :to='"/projects/"+project.id+"/services/"+service.id'>{{service.name}}</router-link>
              </li>
            </ul>
          </p>
        </div>
      </div>
    </article>
  </div>
  <hr>
  <header class="card-header">
    <p class="card-header-title">
      Registered Actors                  
    </p>                
  </header>
  <div class="card-content">
    <article class="media">                  
      <div class="media-content">
        <div class="content">
          <p>
            <ul>
              <li v-for="actor in actors">
                {{actor.actor.fullname}}: {{actor.role}} 
                <button class="button is-danger" v-on:click="removeActor(actor.roleId)">Remove</button>
              </li>
            </ul>   
            <div class="content">
              <button class="button" v-show="!isAddingActor" v-on:click="showAddActor">Add Actor</button>
              <div class="actor-add" v-show="isAddingActor">
                <form id="actor">
                  <p>
                    Full Name: <input type="text" v-model="actorName">
                    <button v-on:click="addActor">Add</button>
                  </p>
                </form>
              </div>
            </div>                       
           </p> 
          
        </div>
      </div>
    </article>
  </div>
  <footer class="card-footer">
    <router-link class="card-footer-item" :to='"/projects/"+project.id+"/clusters/new"'>Register Cluster</router-link>
    <router-link class="card-footer-item" :to='"/projects/"+project.id+"/edit"'>Edit Project</router-link>
    <a href="#" v-on:click="deleteProject" class="card-footer-item">Delete project</a>
    <router-link class="card-footer-item" :to='"/projects/"+project.id+"/services/new"'>Register Service</router-link>

  </footer>

</div>
<!--new style end-->

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
