<template>
  <div class="section is-fullwidth">
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
    <div class="box is-fullwidth">
      <p>
        Service Type: {{this.service_type.name}}
      </p>
      <p>
        Cluster: {{this.cluster}}
      </p>
      <p>
        Docker Service ID: {{service.docker_service_id}}
      </p>
      <p>
        Managed: {{service.managed}}
      </p>
      <p>
        Latitude: {{service.latitude}}
      </p>
      <p>
        Longitude: {{service.longitude}}
      </p>
    </div>
    <div v-show="configuration.length > 0" class="box is-fullwidth">
      <p>
        <ul>
          <li v-for="envVar in configuration">
            {{envVar.name}}: {{envVar.value}}
          </li>
        </ul>
      </p>
    </div>
    <div class="panel-block">
      <button class="button is-primary" v-show="!deploying" v-on:click="deployService"><b>DEPLOY</b></button>
      <button class="button is-primary" v-show="deploying" disabled><b>DEPLOYING...</b></button>
    </div>
    <div class="panel-block">
      <router-link class="button" :to='"/projects/"+this.$route.params.project_id+"/services/"+service.id+"/edit"'>Edit Service</router-link>
      <button class="button is-danger" v-on:click="deleteService"><b>DELETE SERVICE</b></button>
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
    name: 'service',
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
      deleteService: function (event) {
        var projectId = this.$route.params.project_id
        var serviceId = this.$route.params.service_id
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
      deployService: function (event) {
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
