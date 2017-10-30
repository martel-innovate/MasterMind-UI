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
  <input v-model="searchQuery" placeholder="Search...">
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
      </tr>
    </tbody>
  </table>
  <hr/>
  <router-link class="button" :to='"/projects/"+$route.params.id'>Back</router-link>
  <router-link class="button" :to='"/projects/"+$route.params.id+"/services/new"'>Register Service</router-link>
</div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
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
