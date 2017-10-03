<template>
  <section class="box">
    <p class="panel-heading">Register Service</p>
    <div class="box" id="service">
      <label class="label">
        Name:
      </label>
      <p class="control">
        <input class="input" name="name" type="text" v-model="name" placeholder="Name" v-validate.initial="'required|alpha_dash'">
        <p class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</p>
      </p>
      <p class="control">
        <input  type="radio" id="one" value="true" v-model="managed">
        <label class="radio" for="one">Managed</label>
        <input type="radio" id="two" value="false" v-model="managed">
        <label class="radio" for="two">Unmanaged</label>
      </p>
      <label class="label">
        Latitude:
      </label>
      <p class="control">
        <input class="input" name="latitude" type="text" v-model="latitude" v-validate.initial="'required|numeric'">
        <p class="text-danger" v-if="errors.has('latitude')">{{ errors.first('latitude') }}</p>
      </p>
      <label class="label">
        Longitude:
      </label>
      <p class="control">
        <input class="input" name="longitude" type="text" v-model="longitude" v-validate.initial="'required|numeric'">
        <p class="text-danger" v-if="errors.has('longitude')">{{ errors.first('longitude') }}</p>
      </p>
      <label class="label">
        Cluster
      </label>
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
      <label class="label">
         Service Type:
      </label>
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
      <div class="notification" v-if="env_variables">
        <p class="control" v-for="envVar in env_variables">
          {{ envVar.name }} <b v-if="envVar.required">(Required)</b>: <input class="input" type="text" v-model="configuration[envVar.variable]" v-validate.initial="checkIfEnvRequired(envVar)">
        </p>
      </div>
      <div class="notification" v-if="linked_services">
        <p class="control" v-for="linkedService in linked_services">
          {{ linkedService.name }} <b v-if="linkedService.required">(Required)</b>
          <br/>
          <span class="select">
            <select v-model="configuration[linkedService.as]">
              <option v-for="service in services" v-bind:value="service[linkedService.retrieve]">
                {{ service.name }}
              </option>
            </select>
          </span>
        </p>
        <p class="text-danger" v-if="services.length === 0">You must register some services to link to this one</p>
      </div>
    </div>
    <button class="button is-primary" v-on:click="submit" :disabled="errors.any() || cannotRegister || noLinkableServices">Register Service</button>
  </section>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'

  export default {
    name: 'new-service',
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
        managed: false,
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
        noLinkableServices: false
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
        // var projectId = this.$route.params.id
        var currentServiceType = {}
        var allServices = this.services
        var currentServiceTypeId = this.service_type_id
        this.configuration = {}
        var configuration = this.configuration
        this.service_types.forEach(function (st) {
          if (currentServiceTypeId === st.id) {
            currentServiceType = st
          }
        })
        const config = yaml.safeLoad(currentServiceType.configuration_template)
        this.env_variables = config.environment_variables
        this.linked_services = config.services
        if (config.environment_variables) {
          config.environment_variables.forEach(function (envVar) {
            configuration[envVar.variable] = envVar.default
          })
        }
        if (config.services) {
          if (allServices.length > 0) {
            config.services.forEach(function (ser) {
              configuration[ser.as] = allServices[0][ser.retrieve]
            })
            this.noLinkableServices = false
          } else {
            this.noLinkableServices = true
          }
        } else {
          this.noLinkableServices = false
        }
      },
      submit: function (event) {
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
        var projectId = this.$route.params.id
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
          router.push('/projects/' + projectId)
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
