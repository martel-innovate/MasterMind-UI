<template>
  <section class="panel">
    <p class="panel-heading">Register Service</p>
    <div class="panel-block" id="service">
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
      <label class="label">
         Service Type:
      </label>
      <p class="control">
        <span class="select">
          <select v-model="service_type_id" @change="getConfigTemplate">
            <option disabled value="">Select a service type</option>
            <option v-for="service_type in service_types" v-bind:value="service_type.id">
              {{ service_type.name }}
            </option>
          </select>
        </span>
      </p>
      <div class="notification">
        <p class="control" v-for="envVar in env_variables">
        {{ envVar.name }}: <input class="input" type="text" v-model="configuration[envVar.variable]">
      </p>
      </div>

      <div class="notification">
        <p class="control" v-for="linkedService in linked_services">
          {{ linkedService.as }}
          <span class="select">
            <select v-model="configuration[linkedService.as]">
              <option disabled value="">Select a service</option>
              <option v-for="service in services" v-bind:value="service[linkedService.retrieve]">
                {{ service.name }}
              </option>
            </select>
          </span>
        </p>
      </div>
      <button class="button is-primary" v-on:click="submit" :disabled="errors.any()">Register Service</button>
    </div>
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
      axios.get(auth.getAPIUrl() + 'v1/service_types', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.service_types = response.data })
      .catch(error => { console.log(error) })
      axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.clusters = response.data })
      .catch(error => { console.log(error) })
      axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/services', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.services = response.data })
      .catch(error => { console.log(error) })
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
        service_type_id: 1,
        cluster_id: 1,
        service_types: [],
        env_variables: [],
        linked_services: [],
        clusters: [],
        services: []
      }
    },
    methods: {
      getConfigTemplate: function (event) {
        const yaml = require('js-yaml')
        // var projectId = this.$route.params.id
        var currentServiceType = {}
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
