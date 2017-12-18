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
      Managed
    </p>
    <p class="subtitle">
      Whether this Service is managed or unmanaged. Managed Services are deployed
      directly from MasterMind, while Unmanaged Services are already deployed, and
      thus only need to be registered
    </p>
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
    <div v-if="env_variables" v-for="envVar in env_variables">
      <p class="title">
        {{ envVar.name }} <b v-if="envVar.required">(Required)</b>
      </p>
      <p class="subtitle">
        {{ envVar.description }}
      </p>
      <p class="control">
        <input class="input" type="text" v-model="configuration[envVar.variable]" v-validate.initial="checkIfEnvRequired(envVar)">
      </p>
      <hr/>
    </div>
    <div v-if="linked_services" v-for="linkedService in linked_services">
      <p class="title">
        {{ linkedService.name }} <b v-if="linkedService.required">(Required)</b>
      </p>
      <p class="subtitle">
        {{ linkedService.description }}
      </p>
      <span class="select">
        <select v-model="configuration[linkedService.as]">
          <option v-for="service in services" v-bind:value="service[linkedService.retrieve]">
            {{ service.name }}
          </option>
        </select>
      </span>
      <p class="text-danger" v-if="services.length === 0">You must register some services to link to this one</p>
      <hr/>
    </div>
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
      var projectId = this.$route.params.id
      var getConfigTemplate = this.getConfigTemplate
      var promises = []
      promises.push(axios.get(auth.getAPIUrl() + 'v1/service_types', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.service_types = response.data
        if (this.service_types.length > 0) {
          this.service_type_id = this.service_types[0].id
        } else {
          this.cannotRegister = true
        }
      })
      .catch(error => { console.log(error) }))
      promises.push(axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.clusters = response.data
        if (this.clusters.length > 0) {
          this.cluster_id = this.clusters[0].id
        } else {
          this.cannotRegister = true
        }
      })
      .catch(error => { console.log(error) }))
      promises.push(axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/services', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.services = response.data
      })
      .catch(error => { console.log(error) }))
      axios.all(promises).then(response => { getConfigTemplate() }).catch(error => { console.log(error) })
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
        deploying: false
      }
    },
    methods: {
      checkIfEnvRequired: function (envVar) {
        if (envVar.required) {
          return ('required')
        }
        return ('')
      },
      getConfigTemplate: function () {
        const yaml = require('js-yaml')
        var currentServiceType = {}
        this.noLinkableServices = false
        var managed = this.managed
        var allServices = this.services
        var currentServiceTypeId = this.service_type_id
        this.service_types.forEach(function (st) {
          if (currentServiceTypeId === st.id) {
            currentServiceType = st
          }
        })
        const config = yaml.safeLoad(currentServiceType.configuration_template)
        var configuration = {}
        var envVariables = []
        var linkedServices = []
        if (config.environment_variables) {
          config.environment_variables.forEach(function (envVar) {
            if (envVar.managed === (managed === 'true')) {
              envVariables.push(envVar)
              configuration[envVar.variable] = envVar.default
            }
          })
        }
        if (config.services) {
          config.services.forEach(function (ser) {
            if (ser.managed === (managed === 'true')) {
              linkedServices.push(ser)
            }
          })
          if (allServices.length > 0) {
            this.noLinkableServices = false
            linkedServices.forEach(function (ser) {
              configuration[ser.as] = allServices[0][ser.retrieve]
            })
          } else {
            this.noLinkableServices = true
          }
        }
        this.env_variables = envVariables
        this.linked_services = linkedServices
        this.configuration = configuration
      },
      submit: function (event) {
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
        var projectId = this.$route.params.id
        var endpoint = 'Not Deployed'
        if (this.endpoint !== '') {
          endpoint = this.endpoint
        }
        var dockerServiceId = 'Not Deployed'
        if (this.docker_service_id !== '') {
          dockerServiceId = this.docker_service_id
        }
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
      submitAndDeploy: function (event) {
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
        var projectId = this.$route.params.id
        var clusterId = this.cluster_id
        var name = this.name
        this.deploying = true
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
          axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters/' + clusterId + '/deploy?service_id=' + serviceId + '&service_name=' + name, {headers: {'Authorization': auth.getAuthHeader()}})
          .then(response => {
            console.log(response.data)
            router.push('/projects/' + projectId + '/services')
          })
          .catch(error => {
            alert('SERVICE WAS CREATED, BUT DEPLOY TO CLUSTER FAILED: ' + error.response.data.message)
            console.log(error.response.data.message)
            router.push('/projects/' + projectId + '/services')
          })
        })
        .catch(function (error) {
          console.log(error.response.data.message)
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
