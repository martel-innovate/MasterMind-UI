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
  <router-link class="button" :to='"/projects/"+$route.params.id'>Back</router-link>
  <input class="is-pulled-right" v-model="searchQuery" placeholder="Search...">
  <hr/>
  <table class="table">
    <thead>
      <tr class="subtitle">
        <td>Name</td>
        <td>Type</td>
        <td>Cluster</td>
        <td>Docker ID</td>
        <td>Managed</td>
        <td>Status</td>
        <td>Actions</td>
      </tr>
    </thead>
    <tbody>
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
          {{service.status}}
        </td>
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
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.project = response.data })
      .catch(error => { console.log(error) })
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/services', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.services = response.data })
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
      getClusterName: function (clusterId) {
        return this.clusters.find(function (cluster) {
          return cluster.id === clusterId
        })
      },
      getServiceTypeName: function (typeId) {
        return this.service_types.find(function (type) {
          return type.id === typeId
        })
      },
      filterServices: function (services, searchQuery) {
        return services.filter(function (service) {
          return service.name.includes(searchQuery)
        })
      },
      serviceDetails: function (serviceId) {
        router.push('/projects/' + this.$route.params.id + '/services/' + serviceId)
      },
      editService: function (serviceId) {
        router.push('/projects/' + this.$route.params.id + '/services/' + serviceId + '/edit')
      },
      deleteService: function (service) {
        var projectId = this.$route.params.id
        var serviceId = service.id
        var clusterId = service.cluster_id
        var serviceName = service.name
        this.$dialog.confirm('Are you sure you want to delete the Service?', {okText: 'DELETE', cancelText: 'CANCEL'})
        .then(function () {
          if (service.endpoint !== 'Not Deployed') {
            axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters/' + clusterId + '/removestack?service_id=' + serviceId + '&service_name=' + serviceName, {headers: {'Authorization': auth.getAuthHeader()}})
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
            location.reload()
          })
          .catch(function (error) {
            console.log(error)
          })
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
