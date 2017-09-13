<template>
  <div class="service">
    <div class="service-details">
      <h1>Service Details:</h1>
      <ul>
        <li>
          <b>{{service.endpoint}}</b>:
        </li>
        <li>
          Service Type: {{this.service_type}}
        </li>
        <li>
          Cluster: {{this.cluster}}
        </li>
        <li>
          Configuration: {{service.configuration}}
        </li>
        <li>
          Status: {{service.status}}
        </li>
        <li>
          Managed: {{service.managed}}
        </li>
        <li>
          Latitude: {{service.latitude}}
        </li>
        <li>
          Longitude: {{service.longitude}}
        </li>
        <li>
          Docker Service ID: {{service.docker_service_id}}
        </li>
      </ul>
    </div>
    <hr/>
    <div class="edit-service">
      <router-link :to='"/projects/"+this.$route.params.project_id+"/services/"+service.id+"/edit"'>Edit Service</router-link>
    </div>
    <hr/>
    <div class="delete-service">
      <button v-on:click="deleteService"><b>DELETE SERVICE</b></button>
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
        axios.get(auth.getAPIUrl() + 'v1/service_types/' + service.service_type_id, {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => { this.service_type = response.data.name })
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
        service_type: '',
        cluster: ''
      }
    },
    methods: {
      deleteService: function (event) {
        var projectId = this.$route.params.project_id
        axios({
          method: 'delete',
          url: auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/services/' + this.$route.params.service_id,
          headers: { 'Authorization': auth.getAuthHeader() }
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

  a {
    color: #42b983;
  }
</style>
