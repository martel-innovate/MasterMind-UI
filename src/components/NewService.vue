<template>
  <section class="box">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Register Service
          </h1>
        </div>
      </div>
    </section>
    <br/>
    <p class="title">
      Name
    </p>
    <p class="subtitle">
      The name to assign to this Service
    </p>
    <p class="control">
      <input class="input" name="name" type="text" v-model="name" placeholder="Name" v-validate.initial="'required|alpha_dash'">
      <p class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</p>
    </p>
    <hr/>
    <p class="title">
      Service Type
    </p>
    <p class="subtitle">
      The Type of Service to deploy. The available Types can be found in the MasterMind Catalog
    </p>
    <!-- Create dropdown with a list of available service types, on change event generate new config form template -->
    <p class="control">
      <span class="select">
        <select v-model="service_type_id" @change="getConfigTemplate">
          <option v-for="service_type in service_types" v-bind:value="service_type.id">
            {{ service_type.name }}
          </option>
        </select>
      </span>
    </p>
    <p class="text-danger" v-if="service_types.length === 0">No services to deploy</p>
    <hr/>
    <p class="title">
      Endpoint Security
    </p>
    <p class="subtitle">
      Option for securing API backends via Api-Umbrella
    </p>
    <p class="control">
      <label for="agree">
        <input id="agree" type="checkbox" value="agree" v-model="secure_checked"/>
        Secure
      </label>
    </p>
    <div v-if="secure_checked" id="security">
      <h2 class="subtitle">API-Umbrella backend configurations</h2>
      <!-- API Umbrella hostname -->
      <div class="field">
        <p class="control">
          <label class="label">
            API Umbrella Service instance
          </label>
          <span v-tooltip="'The API Umbrella Service instance to use for securing this new Service.'" class="select">
            <select v-model="umb_hostname">
              <option disabled value="">Select an API Umbrella instance to use</option>
              <option v-for="service in filterServicesByType('api-umbrella')" v-bind:value="service.endpoint">
                {{ service.name }}
              </option>
            </select>
          </span>
        </p>
        <p class="text-danger" v-if="clusters.length === 0">You need to register a cluster before registering or deploying services</p>
      </div>
      <!-- API Umbrella admin auth token -->
      <div class="field">
        <p class="control">
          <label class="label">
            API-Umbrella admin authentication token
          </label>
          <input v-tooltip="'Login to the API Umbrella web admin tool (https://api-umbrella-host/admin), and choose My Account under the top right gear menu. On that page, you should see your Admin API Token listed'"
          class="input is-focused" name="umb_admin_token"  v-model="umb_admin_token" type="text" placeholder="admin-api-token" v-validate.initial="'required'">
          <p class="text-danger" v-if="errors.has('umb_admin_token')">{{ errors.first('umb_admin_token') }}</p>
        </p>
      </div>
      <!-- API Umbrella user API -->
      <div class="field">
        <p class="control">
          <label class="label">
            API-Umbrella user API key
          </label>
          <input v-tooltip="'Signup to https://your-api-umbrella-host/signup/ receive your own unique API key for your development environment'"
          class="input is-focused" name="umb_user_key" v-model="umb_user_key" type="text" placeholder="user-api-token" v-validate.initial="'required'">
          <p class="text-danger" v-if="errors.has('umb_user_key')">{{ errors.first('umb_user_key') }}</p>
        </p>
      </div>

      <div class="box">
        <h2 class="subtitle">Securiy Rule</h2>
        <!-- API Umbrella rule name -->
        <div class="field">
          <p class="control">
            <label class="label">
              Rule Name
            </label>
            <input v-tooltip="'Name of this custom security rule'"
            class="input is-focused" name="umb_rule_name" v-model="umb_rule_name" type="text" placeholder="Rule Name" v-validate.initial="'required'">
            <p class="text-danger" v-if="errors.has('umb_rule_name')">{{ errors.first('umb_rule_name') }}</p>
          </p>
        </div>
        <div class="field">
          <p class="control">
            <label class="label">
              Backend server port
            </label>
            <input v-tooltip="'The port used by the backend Service API'"
            class="input is-focused" name="umb_backend_port" v-model="umb_backend_port" type="text" placeholder="80" v-validate.initial="'required'">
            <p class="text-danger" v-if="errors.has('umb_backend_port')">{{ errors.first('umb_backend_port') }}</p>
          </p>
        </div>
        <div class="field">
          <p class="control">
            <label class="label">
              Front matching prefix
            </label>
            <input v-tooltip="'The prefix to use for the URL pointing to this service (e.g. /orion/)'"
            class="input is-focused" name="umb_frontend_prefix" v-model="umb_frontend_prefix" type="text" placeholder="/someUrl/" v-validate.initial="'required'">
            <p class="text-danger" v-if="errors.has('umb_frontend_prefix')">{{ errors.first('umb_frontend_prefix') }}</p>
          </p>
        </div>
        <div class="field">
          <p class="control">
            <label class="label">
              Backend matching prefix
            </label>
            <input v-tooltip="'The prefix for the backend Service API URLs (use / to match all URLs)'"
            class="input is-focused" name="umb_backend_prefix" v-model="umb_backend_prefix" type="text" placeholder="/" v-validate.initial="'required'">
            <p class="text-danger" v-if="errors.has('umb_backend_prefix')">{{ errors.first('umb_backend_prefix') }}</p>
          </p>
        </div>
      </div>
    </div>

    <hr/>
    <p class="title">
      Managed
    </p>
    <p class="subtitle">
      Whether this Service is managed or unmanaged. Managed Services are deployed
      directly from MasterMind, while Unmanaged Services are already deployed, and
      thus only need to be registered
    </p>
    <!-- Select between Managed and Unmanaged for the Service, on change event generate new config form template -->
    <p class="control">
      <span class="select">
        <select v-model="managed" @change="getConfigTemplate">
          <option value="true">Managed</option>
          <option value="false">Unmanaged</option>
        </select>
      </span>
    </p>
    <hr/>
    <div v-if='managed == "true"'>
      <p class="title">
        Cluster
      </p>
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
      <p class="text-danger" v-if="clusters.length === 0">You need to register a cluster before registering or deploying services</p>
      <hr/>
    </div>
    <div v-if='managed == "false"'>
      <p class="title">
        Service Endpoint
      </p>
      <p class="subtitle">
        The endpoint of the unmanaged Service to register, including port and protocol
        (e.g. http://192.168.99.100:8080)
      </p>
      <p class="control">
        <input class="input" name="endpoint" type="text" v-model="endpoint" placeholder="Endpoint" v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('endpoint')">{{ errors.first('endpoint') }}</p>
      </p>
      <hr/>
      <p class="title">
        Docker Service ID
      </p>
      <p class="subtitle">
        The ID of the unmanaged Service within Docker. This is generally the Docker Swarm stack name
      </p>
      <p class="control">
        <input class="input" name="docker_service_id" type="text" v-model="docker_service_id" placeholder="Docker Service ID" v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('docker_service_id')">{{ errors.first('docker_service_id') }}</p>
      </p>
      <hr/>
    </div>
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
    <!-- Display warnings and disable buttons if requirements not met to register Service -->
    <p class="text-danger" v-if="noLinkableServices">You don't have the required dependent Services registered in order to deploy this Service</p>
    <hr v-if="noLinkableServices"/>
    <!-- Deploy button, switching between disabled, enabled, or pending deployment -->
    <button class="button is-primary" v-show="!deploying" v-on:click="submit" :disabled="errors.any() || cannotRegister || noLinkableServices">Register Service</button>
    <button class="button is-primary" v-show='!deploying && managed == "true"' v-on:click="submitAndDeploy" :disabled="errors.any() || cannotRegister || noLinkableServices">Register and Deploy Service</button>
    <button class="button is-primary" v-show="deploying" disabled><b>DEPLOYING...</b></button>
    <router-link class="button" :to='"/projects/"+this.$route.params.id'>Back</router-link>
  </section>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'

  export default {
    created () {
      // Set these variables outside of axios functions
      var projectId = this.$route.params.id
      var getConfigTemplate = this.getConfigTemplate
      // List of axios promises for syncing action after all promises fulfilled
      var promises = []
      // Get service types
      promises.push(axios.get(auth.getAPIUrl() + 'v1/service_types', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.service_types = response.data
        // Check if at leats one service type to deploy exists
        if (this.service_types.length > 0) {
          this.service_type_id = this.service_types[0].id
        } else {
          this.cannotRegister = true
        }
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
      // Once Services, Clusers and Service Types obtained, generate config template
      axios.all(promises).then(response => {
        getConfigTemplate()
      })
      .catch(error => {
        console.log(error)
      })
    },
    data () {
      return {
        name: '',
        configuration: {},
        status: 'Inactive',
        managed: 'true',
        endpoint: '',
        latitude: 0,
        longitude: 0,
        docker_service_id: '',
        service_type_id: 0,
        cluster_id: 0,
        service_types: [],
        env_variables: [],
        linked_services: [],
        clusters: [],
        services: [],
        cannotRegister: false,
        noLinkableServices: false,
        deploying: false,
        secure_checked: false,
        umb_hostname: '',
        umb_admin_token: '',
        umb_user_key: '',
        umb_rule_name: '',
        umb_frontend_host: '',
        umb_backend_host: '',
        umb_backend_server: '',
        umb_backend_port: '',
        umb_frontend_prefix: '',
        umb_backend_prefix: ''
      }
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
            if (envVar.managed === (managed === 'true')) {
              envVariables.push(envVar)
              configuration[envVar.variable] = envVar.default
            }
          })
        }
        // If linked services are defined in the MasterMind config for this service
        // type, push them to the list of possible links (depending on managed/unmanaged).
        // If there are not enough services to link, set noLinkableServices to true.
        // If there are services, set a default to the first available service.
        if (config.services) {
          config.services.forEach(function (ser) {
            if (ser.managed === (managed === 'true')) {
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
      // Submit the new service to the API
      submit: function (event) {
        // If form isn't valid, return
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
        // Set this outside of axios functions
        var projectId = this.$route.params.id
        // By default, an undeployed service will be Not Deployed for endpoint and
        // Docker Service ID
        var endpoint = 'Not Deployed'
        if (this.endpoint !== '') {
          endpoint = this.endpoint
        }
        var dockerServiceId = 'Not Deployed'
        if (this.docker_service_id !== '') {
          dockerServiceId = this.docker_service_id
        }
        // Send POST to API
        axios({
          method: 'post',
          url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/services',
          headers: { 'Authorization': auth.getAuthHeader() },
          data: {
            name: this.name,
            service_type_id: this.service_type_id,
            configuration: JSON.stringify(this.configuration),
            latitude: this.latitude,
            longitude: this.longitude,
            managed: this.managed,
            cluster_id: this.cluster_id,
            status: 'Inactive',
            endpoint: endpoint,
            docker_service_id: dockerServiceId
          }
        })
        .then(function (response) {
          console.log(response.data)
          router.push('/projects/' + projectId + '/services')
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      // Submits the new Service and deploys it straight away
      // TODO: Fix duplicate code from submit
      submitAndDeploy: function (event) {
        // Checking if form is valid, return if not
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
        // Setting these outside of axios functions
        var projectId = this.$route.params.id
        var clusterId = this.cluster_id
        var name = this.name
        var secureChecked = this.secure_checked
        var secureService = this.secureService
        // Set this variable to disable deploy buttons while attempting deploy
        this.deploying = true
        // Send POST to API
        axios({
          method: 'post',
          url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/services',
          headers: { 'Authorization': auth.getAuthHeader() },
          data: {
            name: this.name,
            service_type_id: this.service_type_id,
            configuration: JSON.stringify(this.configuration),
            latitude: this.latitude,
            longitude: this.longitude,
            managed: this.managed,
            cluster_id: this.cluster_id,
            status: 'Inactive',
            endpoint: 'Not deployed',
            docker_service_id: 'Not Deployed'
          }
        })
        .then(function (response) {
          console.log(response.data)
          var serviceId = response.data.id
          // Send request to API to deploy the newly created service
          axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters/' + clusterId + '/deploy?service_id=' + serviceId + '&service_name=' + name, {headers: {'Authorization': auth.getAuthHeader()}})
          .then(response => {
            alert('SERVICE SUCCESSFULLY CREATED AND DEPLOYED')
            console.log(response.data)
            if (secureChecked) {
              secureService()
            }
            router.push('/projects/' + projectId + '/services')
          })
          .catch(error => {
            // Display alert if failure to deploy
            alert('SERVICE WAS CREATED, BUT DEPLOY TO CLUSTER FAILED: ' + error.response.data.message)
            console.log(error.response.data.message)
            router.push('/projects/' + projectId + '/services')
          })
        })
        .catch(function (error) {
          console.log(error.response.data.message)
        })
      },
      secureService: function (event) {
        // var projectId = this.$route.params.id
        var host = 'https://' + this.umb_hostname
        var apiKey = this.umb_user_key
        var adminAuthToken = this.umb_admin_token
        var payload =
          {
            'api': {
              'host': host,
              'X-Api-Key': apiKey,
              'X-Admin-Auth-Token': adminAuthToken,
              'name': this.umb_rule_name,
              'frontend_host': this.umb_hostname,
              'backend_host': this.umb_hostname,
              'servers': [
                {
                  'host': this.umb_hostname,
                  'port': this.umb_backend_port
                }
              ],
              'url_matches': [
                {
                  'frontend_prefix': this.umb_frontend_prefix,
                  'backend_prefix': this.umb_backend_prefix
                }
              ]
            }
          }
        axios({
          method: 'post',
          url: auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/services/secureservice',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': auth.getAuthHeader()
          },
          data: {
            payload
          }
        })
        .then(function (response) {
          alert('API backend is saved')
          var id = response.data
          console.log(id)
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
  label {
    color: #222324;
    display: block;
    font-weight: bold;
    display:block; width:x; height:y; text-align:left;
  }
  a {
    color: #42b983;
  }
</style>
