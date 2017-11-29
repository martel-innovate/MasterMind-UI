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
  <section>
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
    <router-link class="button" :to='"/"'>Back</router-link>
    <router-link class="button" :to='"/projects/"+project.id+"/edit"'>Edit Project</router-link>
    <a href="#" v-on:click="deleteProject" class="button is-danger">Delete project</a>
  </div>
</div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  export default {
    created () {
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
