<template>
<div class="box is-fullwidth">
  <section class="hero is-primary">
    <div class="hero-body has-text-centered">
      <h1 class="title">
        {{project.name}} Services
      </h1>
      <h2 class="subtitle">
        The IoT services registered in this Project
      </h2>
    </div>
  </section>
  <br/>
  <div>
    <router-link :to='"/"'>Projects</router-link>
    /
    <router-link :to='"/projects/"+$route.params.id'>{{project.name}}</router-link>
    /
    Services
    <!-- Search box -->
    <input class="is-pulled-right" v-model="searchQuery" placeholder="Search...">
  </div>
  <hr/>
  <table class="table">
    <thead>
      <tr class="subtitle">
        <td>Name</td>
        <td>Type</td>
        <td>Cluster</td>
        <td>Docker ID</td>
        <td>Managed</td>
        <td>Secured</td>
        <td>Status</td>
        <td>Actions</td>
      </tr>
    </thead>
    <tbody>
      <!-- List the services in this project, filtered by the search query string -->
      <tr v-for="service in filterServices(services, searchQuery)">
        <td>
          <router-link :to='"/projects/"+$route.params.id+"/services/"+service.id'>{{service.name}}</router-link>
        </td>
        <td>
          <router-link v-if="getServiceTypeName(service.service_type_id)" :to='"/catalog/"+service.service_type_id'>{{getServiceTypeName(service.service_type_id).name}}</router-link>
        </td>
        <td>
          <router-link v-if="getClusterName(service.cluster_id)" :to='"/projects/"+$route.params.id+"/clusters/"+service.cluster_id'>{{getClusterName(service.cluster_id).name}}</router-link>
        </td>
        <td>
          {{service.docker_service_id}}
        </td>
        <td>
          {{service.managed}}
        </td>
        <td>
          {{service.secured}}
        </td>
        <td>
          {{service.status}}
        </td>
        <!-- Display buttons for actions: details, edit, delete -->
        <!-- TODO: Could add deploy/undeploy button? -->
        <td>
          <span class="button" v-tooltip="'View Service details'">
            <i class="fa fa-eye" v-on:click='serviceDetails(service.id)'></i>
          </span>
          &nbsp
          <span class="button" v-tooltip="'Edit Service'">
            <i class="fa fa-edit" v-on:click='editService(service.id)'></i>
          </span>
          &nbsp
          <span class="button" v-tooltip="'Delete Service'">
            <i class="fa fa-trash" v-on:click='deleteService(service)'></i>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
  <hr/>
  <router-link class="button is-primary" :to='"/projects/"+$route.params.id+"/services/new"'>Register Service</router-link>
</div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  export default {
    created () {
      // Get services, clusters, project, service types
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.project = response.data })
      .catch(error => { console.log(error) })
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/services', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.services = response.data
        console.log(this.services)
      })
      .catch(error => { console.log(error) })
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/clusters', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.clusters = response.data })
      .catch(error => { console.log(error) })
      axios.get(auth.getAPIUrl() + 'v1/service_types', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.service_types = response.data })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        project: {},
        services: [],
        clusters: [],
        service_types: [],
        searchQuery: ''
      }
    },
    methods: {
      // Get the name of a cluster given the ID
      getClusterName: function (clusterId) {
        return this.clusters.find(function (cluster) {
          return cluster.id === clusterId
        })
      },
      // Get the name of a service given the ID
      getServiceTypeName: function (typeId) {
        return this.service_types.find(function (type) {
          return type.id === typeId
        })
      },
      // Filter services by name
      filterServices: function (services, searchQuery) {
        return services.filter(function (service) {
          return service.name.includes(searchQuery)
        })
      },
      // Service details redirect
      serviceDetails: function (serviceId) {
        router.push('/projects/' + this.$route.params.id + '/services/' + serviceId)
      },
      // Service edit redirect
      editService: function (serviceId) {
        router.push('/projects/' + this.$route.params.id + '/services/' + serviceId + '/edit')
      },
      // Delete service
      deleteService: function (service) {
        // Set these outside of axios functions
        var sendDeleteToApi = this.sendDeleteToApi
        var projectId = this.$route.params.id
        var serviceId = service.id
        var clusterId = service.cluster_id
        var serviceName = service.name
        var serviceEndpoint = service.endpoint
        // Confirmation dialog box
        this.$dialog.confirm('Are you sure you want to delete the Service?', {okText: 'DELETE', cancelText: 'CANCEL'})
        .then(function () {
          // If Service is deployed, remove stack from Docker Swarm cluster as well
          if (serviceEndpoint !== 'Not Deployed') {
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
          location.reload()
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
