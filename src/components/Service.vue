<template>
  <div class="box is-fullwidth">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{service.name}}
          </h1>
          <h2 class="subtitle">
            {{service.endpoint}}, {{service.status}}
          </h2>
        </div>
      </div>
    </section>
    <br/>
    <p class="title">
      Service Type
    </p>
    <p class="subtitle">
      {{this.service_type.name}}
    </p>
    <hr/>
    <p class="title">
      Cluster
    </p>
    <p class="subtitle">
      {{this.cluster}}
    </p>
    <hr/>
    <p class="title">
      Docker Service ID
    </p>
    <p class="subtitle">
      {{service.docker_service_id}}
    </p>
    <hr/>
    <p class="title">
      Managed
    </p>
    <p class="subtitle">
      {{service.managed}}
    </p>
    <hr/>
    <p class="title">
      Latitude
    </p>
    <p class="subtitle">
      {{service.latitude}}
    </p>
    <hr/>
    <p class="title">
      Longitude
    </p>
    <p class="subtitle">
      {{service.longitude}}
    </p>
    <hr/>
    <div v-show="configuration.length > 0">
      <div v-for="envVar in configuration">
        <p class="title">
          {{envVar.name}}
        </p>
        <p class="subtitle">
          {{envVar.value}}
        </p>
        <hr/>
      </div>
    </div>
    <div class="panel-block">
      <router-link class="button" :to='"/projects/"+this.$route.params.project_id'>Back</router-link>
      <router-link class="button" :to='"/projects/"+this.$route.params.project_id+"/services/"+service.id+"/edit"'>Edit Service</router-link>
      <button class="button is-primary" v-show="!deploying" v-on:click="deployService"><b>DEPLOY</b></button>
      <button class="button is-primary" v-show="deploying" disabled><b>DEPLOYING...</b></button>
      <button class="button is-danger" v-on:click="deleteService"><b>DELETE SERVICE</b></button>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  export default {
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/services/' + this.$route.params.service_id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        var service = response.data
        this.service = service
        var configurationJSON = JSON.parse(service.configuration)
        var configurationArray = []
        for (var envVar in configurationJSON) {
          configurationArray.push({name: envVar, value: configurationJSON[envVar]})
        }
        this.configuration = configurationArray
        console.log(configurationArray)
        axios.get(auth.getAPIUrl() + 'v1/service_types/' + service.service_type_id, {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => { this.service_type = response.data })
        .catch(error => { console.log(error) })
        axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/clusters/' + service.cluster_id, {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => { this.cluster = response.data.name })
        .catch(error => { console.log(error) })
        this.getService()
      })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        service: {},
        configuration: [],
        service_type: '',
        cluster: '',
        deploying: false
      }
    },
    methods: {
      deleteService: function () {
        var projectId = this.$route.params.project_id
        var serviceId = this.$route.params.service_id
        var serviceName = this.service.name
        if (this.service.endpoint !== 'Not deployed') {
          axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters/' + this.service.cluster_id + '/removestack?service_id=' + serviceId + '&service_name=' + serviceName, {headers: {'Authorization': auth.getAuthHeader()}})
          .then(response => {
            console.log(response.data)
            router.push('/projects/' + projectId)
          })
          .catch(error => { console.log(error) })
        }
        axios({
          method: 'delete',
          url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/services/' + serviceId,
          headers: { 'Authorization': auth.getAuthHeader() }
        })
        .then(function (response) {
          console.log(response.data)
          router.push('/projects/' + projectId)
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      deployService: function () {
        this.deploying = true
        var projectId = this.$route.params.project_id
        var serviceId = this.$route.params.service_id
        var serviceName = this.service.name
        axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters/' + this.service.cluster_id + '/deploy?service_id=' + serviceId + '&service_name=' + serviceName, {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          console.log(response.data)
          router.push('/projects/' + projectId)
        })
        .catch(error => { console.log(error) })
      },
      getService: function () {
        if (this.service.endpoint === 'Not deployed') {
          return
        }
        var projectId = this.$route.params.project_id
        var serviceId = this.$route.params.service_id
        var serviceName = this.service.name
        console.log(serviceName)
        axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters/' + this.service.cluster_id + '/getstack?service_id=' + serviceId + '&service_name=' + serviceName, {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
          axios({
            method: 'put',
            url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/services/' + serviceId,
            headers: { 'Authorization': auth.getAuthHeader() },
            data: {
              endpoint: 'Not deployed',
              status: 'Inactive'
            }
          })
          .then(function (response) {
            console.log(response.data)
            location.reload()
          })
          .catch(function (error) {
            console.log(error)
          })
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
