<template>
<div class="box is-fullwidth">
  <section class="hero is-primary">
    <div class="hero-body has-text-centered">
      <h1 class="title">
        {{project.name}}
      </h1>
      <h2 class="subtitle">
        {{project.description}}
      </h2>
    </div>
  </section>
  <br/>
  <div>
    <router-link class="button" :to='"/"'>Back</router-link>
  </div>
  <hr/>
  <!-- Display some hints if there's no services or clusters registered already -->
  <div v-if="services.length === 0 || clusters.length === 0">
    <p class="text-warning" v-if="services.length === 0">
      You may start registering Services by clicking on the corresponding button below.
    </p>
    <p class="text-warning" v-if="clusters.length === 0">
      To start deploying managed Services, you need to register a Cluster first. Click on the corresponding button below to do so.
    </p>
    <hr/>
  </div>
  <section>
    <!-- Entries and counters for services, clusters, subs and actors (roles) -->
    <div class="columns">
      <div class="column is-one-half">
        <router-link class="button is-large has-text-centered is-info is-outlined is-fullwidth" :to='"/projects/"+this.$route.params.id+"/clusters"'>
          Clusters: {{clusters.length}}
        </router-link>
      </div>
      <div class="column is-one-half">
        <router-link class="button is-large has-text-centered is-info is-outlined is-fullwidth" :to='"/projects/"+this.$route.params.id+"/services"'>
          Services: {{services.length}}
        </router-link>
      </div>
    </div>
    <div class="columns">
      <div class="column is-one-half">
        <router-link class="button is-large has-text-centered is-info is-outlined is-fullwidth" :to='"/projects/"+this.$route.params.id+"/subscriptions"'>
          Subscriptions: {{subscriptions.length}}
        </router-link>
      </div>
      <div class="column is-one-half">
        <router-link class="button is-large has-text-centered is-info is-outlined is-fullwidth" :to='"/projects/"+this.$route.params.id+"/actors"'>
          Actors: {{roles.length}}
        </router-link>
      </div>
    </div>
  </section>
  <hr/>
  <div class="buttons">
    <router-link class="button" :to='"/projects/"+project.id+"/edit"'>Edit Project</router-link>
    <a v-on:click="deleteProject" class="button is-danger">Delete project</a>
  </div>
</div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  export default {
    created () {
      // Get project related data
      // TODO: Optimise this on the UI or API side, cache this?
      console.log(auth.getAPIUrl())
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
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/roles', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.roles = response.data })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        project: {},
        clusters: [],
        services: [],
        subscriptions: [],
        roles: []
      }
    },
    methods: {
      // Delete the current project
      deleteProject: function (event) {
        // Set this outside of axios functions
        var projectId = this.$route.params.id
        // Confirm dialog box
        this.$dialog.confirm('Are you sure you want to delete the Project?', {okText: 'DELETE', cancelText: 'CANCEL'})
        // DELETE to API
        .then(function () {
          axios({
            method: 'delete',
            url: auth.getAPIUrl() + 'v1/projects/' + projectId,
            headers: { 'Authorization': auth.getAuthHeader() }
          })
          .then(function (response) {
            console.log(response.data)
            router.push('/projects')
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
