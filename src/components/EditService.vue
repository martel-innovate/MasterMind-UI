<template>
  <div class="box">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Edit {{ name }} Service
          </h1>
        </div>
      </div>
    </section>
    <hr/>
    <h2 v-show="status != 'Inactive'" class="text-danger">
      Note: This Service is currently deployed. In order to make any changes the
      Service will need to be redeployed.
      <hr/>
    </h2>
    <p class="title">
      Cluster
    </p>
    <div v-show="status != 'Inactive'">
      <p class="subtitle text-danger">
        Cannot edit the Cluster if the Service is deployed
      </p>
    </div>
    <div v-show="status == 'Inactive'">
      <p class="subtitle">
        The Cluster to deploy the managed Service on. At least one Cluster needs
        to be registered within this Project in order to deploy a Service
      </p>
      <!-- Select a cluster to deploy on -->
      <p class="control">
        <span class="select">
          <select v-model="cluster_id">
            <option disabled value="">Select a cluster</option>
            <option v-for="cluster in clusters" v-bind:value="cluster.id">
              {{ cluster.name }}
            </option>
          </select>
        </span>
      </p>
    </div>
    <hr/>
    <!-- List environment variables to configure, with an input field for each -->
    <div v-if="env_variables" v-for="envVar in env_variables">
      <p class="title">
        {{ envVar.name }} <b v-if="envVar.required">(Required)</b>
      </p>
      <p class="subtitle">
        {{ envVar.description }}
      </p>
      <p class="control">
        <!-- Input field for env variable, map to configuration, check if required or optional -->
        <input class="input" type="text" v-model="configuration[envVar.variable]" v-validate.initial="checkIfEnvRequired(envVar)">
      </p>
      <hr/>
    </div>
    <!-- List linkable services fields -->
    <div v-if="linked_services" v-for="linkedService in linked_services">
      <p class="title">
        {{ linkedService.name }} <b v-if="linkedService.required">(Required)</b>
      </p>
      <p class="subtitle">
        {{ linkedService.description }}
      </p>
      <!-- For each linkable service, list the services registered to this project, filtered by type specified in configuration template -->
      <span class="select">
        <select v-model="configuration[linkedService.as]">
          <option v-for="service in filterServicesByType(linkedService.service_type)" v-bind:value="service[linkedService.retrieve]">
            {{ service.name }}
          </option>
        </select>
      </span>
      <hr/>
    </div>
    <button class="button is-primary" v-on:click="submit" :disabled="errors.any()">Edit Service</button>
    <router-link class="button" :to='"/projects/"+this.$route.params.project_id+"/services/"+this.$route.params.service_id'>Back</router-link>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'

  Vue.use(VeeValidate)

  export default {
    data () {
      return {
        name: '',
        clusters: [],
        services: [],
        cluster_id: 0,
        service_type_id: 0,
        prevConfiguration: '',
        configuration: [],
        status: '',
        managed: 'true',
        env_variables: [],
        linked_services: [],
        noLinkableServices: false,
        cannotRegister: false
      }
    },
    created () {
      // Set these variables outside of axios functions
      var projectId = this.$route.params.project_id
      var serviceId = this.$route.params.service_id
      var getConfigTemplate = this.getConfigTemplate
      // List of axios promises for syncing action after all promises fulfilled
      var promises = []
      // Get service types
      promises.push(axios.get(auth.getAPIUrl() + 'v1/service_types', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.service_types = response.data
      })
      .catch(error => { console.log(error) }))
      // Get clusters
      promises.push(axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.clusters = response.data
        // Check if at least 1 cluster registered in project
        if (this.clusters.length > 0) {
          this.cluster_id = this.clusters[0].id
        } else {
          this.cannotRegister = true
        }
      })
      .catch(error => { console.log(error) }))
      // Get Services
      promises.push(axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/services', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.services = response.data
      })
      .catch(error => { console.log(error) }))
      // Get this Service
      promises.push(axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/services/' + serviceId, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.name = response.data.name
        this.prevConfiguration = response.data.configuration
        this.cluster_id = response.data.cluster_id
        this.service_type_id = response.data.service_type_id
        this.status = response.data.status
        this.managed = response.data.managed
      })
      .catch(error => { console.log(error) }))
      // Once Services, Clusers and Service Types obtained, generate config template
      axios.all(promises).then(response => {
        getConfigTemplate()
      })
      .catch(error => {
        console.log(error)
      })
    },
    methods: {
      // Check if an environment variable is required or optional
      checkIfEnvRequired: function (envVar) {
        if (envVar.required) {
          return ('required')
        }
        return ('')
      },
      // Filter services by a given type
      filterServicesByType: function (type) {
        var findServiceTypeById = this.findServiceTypeById
        var filtered = this.services.filter(function (service) {
          return findServiceTypeById(service.service_type_id).name === type
        })
        // If no service matched the filter, at least one of the linked services
        // entries has no service to link, therefore we set this variable
        if (filtered.length === 0) {
          this.noLinkableServices = true
        }
        return filtered
      },
      // Finds a service type matching a given id
      findServiceTypeById: function (id) {
        var serviceType = this.service_types.find(function (type) {
          return type.id === id
        })
        return serviceType
      },
      // Retrieves a generates a configuration template for the currently selected
      // service type
      getConfigTemplate: function () {
        const yaml = require('js-yaml')
        // Resetting these values
        var currentServiceType = {}
        this.noLinkableServices = false
        // Setting these variables outside of axios functions
        var managed = this.managed
        var allServices = this.services
        var currentServiceTypeId = this.service_type_id
        var prevConfiguration = JSON.parse(this.prevConfiguration)
        // Sets the currently selected service type by finding it by id
        this.service_types.forEach(function (st) {
          if (currentServiceTypeId === st.id) {
            currentServiceType = st
          }
        })
        // Load the config template yaml into an object format
        const config = yaml.safeLoad(currentServiceType.configuration_template)
        // Sets variables for configuration, env variables and links
        var configuration = {}
        var envVariables = []
        var linkedServices = []
        // If environment variables are defined in the MasterMind config for this
        // service type, push them to the list of env variables for the form to
        // generate, if they are for managed/unmanaged services depending on what
        // was selected, and set their default value
        if (config.environment_variables) {
          config.environment_variables.forEach(function (envVar) {
            if (envVar.managed === (managed === true)) {
              envVariables.push(envVar)
              configuration[envVar.variable] = prevConfiguration[envVar.variable]
            }
          })
        }
        // If linked services are defined in the MasterMind config for this service
        // type, push them to the list of possible links (depending on managed/unmanaged).
        // If there are not enough services to link, set noLinkableServices to true.
        // If there are services, set a default to the first available service.
        if (config.services) {
          config.services.forEach(function (ser) {
            if (ser.managed === (managed === true)) {
              linkedServices.push(ser)
            }
          })
          if (allServices.length > 0) {
            this.noLinkableServices = false
            linkedServices.forEach(function (ser) {
              // Note: ser.as is the env variable the linked service will correspond
              // to, and ser.retrieve is the value of the linked service to have in the
              // env variable.
              // e.g. for an orion service being deployed, MONGO_URI = <endpoint of service mongo>
              configuration[ser.as] = allServices[0][ser.retrieve]
            })
          } else {
            this.noLinkableServices = true
          }
        }
        // Set the variables in data of this component
        this.env_variables = envVariables
        this.linked_services = linkedServices
        this.configuration = configuration
      },
      // Submit edit
      submit: function (event) {
        // Check of form is valid
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
        // Set this outside of axios function
        var projectId = this.$route.params.project_id
        var serviceId = this.$route.params.service_id
        // Send PUT to API
        axios({
          method: 'put',
          url: auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/services/' + this.$route.params.service_id,
          headers: { 'Authorization': auth.getAuthHeader() },
          data: {
            cluster_id: this.cluster_id,
            configuration: JSON.stringify(this.configuration)
          }
        })
        .then(function (response) {
          console.log(response.data)
          router.push('/projects/' + projectId + '/services/' + serviceId)
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
