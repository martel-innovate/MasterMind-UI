<template>
  <div class="box is-fullwidth">
    <section class="hero is-primary">
      <div class="hero-body">
        <h1 class="title is-2">
          {{service.name}}
        </h1>
        <h2 class="subtitle is-4">
          {{service.endpoint}}, {{service.status}}
        </h2>
      </div>
    </section>
    <hr/>
    <div class="box">
      <p class="title">
        Current Status on the Cluster
      </p>
      <p v-for="entry in currentStatus">
        {{ entry.name }} : {{entry.status}}
      </p>
    </div>
    <hr/>
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
    <!-- List the configuration variables -->
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
    <hr v-if="configuration.length > 0"></hr>
    <!-- Buttons -->
    <div class="buttons">
      <router-link class="button is-medium" :to='"/projects/"+this.$route.params.project_id+"/services"'>Back</router-link>
      <router-link class="button is-medium" :to='"/projects/"+this.$route.params.project_id+"/services/"+service.id+"/edit"'>Edit Service</router-link>
      <!-- Show deploy/undeploy button or deploying/undeploying disabled button depending on whether service is being deployed/undeployed -->
      <button class="button is-medium is-primary" v-show="service.status == 'Inactive' && !deploying" v-on:click="deployService"><b>DEPLOY</b></button>
      <button class="button is-medium is-primary" v-show="service.status == 'Inactive' && deploying" disabled><b>DEPLOYING...</b></button>
      <button class="button is-medium is-danger" v-show="service.status != 'Inactive' && !undeploying" v-on:click="undeployService"><b>UNDEPLOY</b></button>
      <button class="button is-medium is-danger" v-show="service.status != 'Inactive' && undeploying" disabled><b>UNDEPLOYING...</b></button>
      <button class="button is-medium is-danger" v-on:click="deleteService"><b>DELETE SERVICE</b></button>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  export default {
    created () {
      // Get Service details from API
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/services/' + this.$route.params.service_id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        var service = response.data
        this.service = service
        // Parse config JSON string into object
        var configurationJSON = JSON.parse(service.configuration)
        // Push env vars into array to display
        var configurationArray = []
        for (var envVar in configurationJSON) {
          configurationArray.push({name: envVar, value: configurationJSON[envVar]})
        }
        this.configuration = configurationArray
        console.log(configurationArray)
        // Get Service type of this Service
        axios.get(auth.getAPIUrl() + 'v1/service_types/' + service.service_type_id, {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => { this.service_type = response.data })
        .catch(error => { console.log(error) })
        // Get Cluster of this Service
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
        deploying: false,
        undeploying: false,
        currentStatus: []
      }
    },
    methods: {
      // Delete Service
      deleteService: function (service) {
        // Setting these variables outside of axios functions
        var sendDeleteToApi = this.sendDeleteToApi
        var projectId = this.$route.params.project_id
        var serviceId = this.service.id
        var clusterId = this.service.cluster_id
        var serviceName = this.service.name
        var serviceEndpoint = this.service.endpoint
        // Confirmation dialog
        this.$dialog.confirm('Are you sure you want to delete the Service?', {okText: 'DELETE', cancelText: 'CANCEL'})
        .then(function () {
          // If Service is deployed, remove stack from Docker Swarm cluster as well
          if ((serviceEndpoint).toLowerCase() !== 'not deployed') {
            axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters/' + clusterId + '/removestack?service_id=' + serviceId + '&service_name=' + serviceName, {headers: {'Authorization': auth.getAuthHeader()}})
            .then(response => {
              console.log(response.data)
              sendDeleteToApi(projectId, serviceId)
            })
            .catch(error => { console.log(error) })
          } else {
            sendDeleteToApi(projectId, serviceId)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      // Send DELETE to API
      sendDeleteToApi: function (projectId, serviceId) {
        // DELETE to API
        axios({
          method: 'delete',
          url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/services/' + serviceId,
          headers: { 'Authorization': auth.getAuthHeader() }
        })
        .then(function (response) {
          console.log(response.data)
          router.push('/projects/' + projectId + '/services')
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      // Deploy the Service to the cluster
      deployService: function () {
        // Set deploying to disable buttons
        this.deploying = true
        // Setting these variables outside of axios functions
        var projectId = this.$route.params.project_id
        var serviceId = this.$route.params.service_id
        var serviceName = this.service.name
        // Deploy stack on Docker Swarm cluster
        axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters/' + this.service.cluster_id + '/deploy?service_id=' + serviceId + '&service_name=' + serviceName, {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          console.log(response.data)
          location.reload()
        })
        .catch(error => {
          // Pop up an alert if deployment fails
          alert('DEPLOYMENT FAILED: ' + error.response.data.message)
          console.log(error.response.data.message)
          this.deploying = false
        })
      },
      // Undeploy the Service from the cluster
      undeployService: function () {
        // Set undeploying to disable buttons
        this.undeploying = true
        // Setting these variables outside of axios functions
        var projectId = this.$route.params.project_id
        var serviceId = this.$route.params.service_id
        var serviceName = this.service.name
        // Undeploy stack from Docker Swarm cluster
        axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters/' + this.service.cluster_id + '/removestack?service_id=' + serviceId + '&service_name=' + serviceName, {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          console.log(response.data)
          location.reload()
        })
        .catch(error => {
          // Pop up an alert if deployment fails
          alert('UNDEPLOYMENT FAILED: ' + error.response.data.message)
          console.log(error.response.data.message)
          this.undeploying = false
        })
      },
      // Get Service (stack) details from the Swarm Cluster
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
          // TODO: Better format and display this
          this.currentStatus = JSON.parse((response.data.stack_status).replace(/'/g, '"'))
        })
        .catch(error => {
          console.log(error)
          // TODO: Better format and display this
          this.currentStatus = error
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
