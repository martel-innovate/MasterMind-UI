<template>
  <div class="panel-block">
    <p class="panel-heading">Service Details:</p>
      <ul>
        <li>
          <b>{{service.name}}</b>:
        </li>
        <li>
          Service Type: {{this.service_type.name}}
        </li>
        <li>
          Cluster: {{this.cluster}}
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
          Endpoint: {{service.endpoint}}
        </li>
        <li>
          Docker Service ID: {{service.docker_service_id}}
        </li>
        <li>
          Configuration: {{service.configuration}}
        </li>
      </ul>
    <hr/>
    <div class="panel-block">
      <router-link :to='"/projects/"+this.$route.params.project_id+"/services/"+service.id+"/edit"'>Edit Service</router-link>
    </div>
    <hr/>
    <div class="panel-block">
      <button class="button is-primary" v-show="!deploying" v-on:click="deployService"><b>DEPLOY</b></button>
      <button class="button is-primary" v-show="deploying" disabled><b>DEPLOYING...</b></button>
    </div>
    <hr/>
    <div class="panel-block">
      <button class="button is-danger" v-on:click="deleteService"><b>DELETE SERVICE</b></button>
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
        .then(response => { this.service_type = response.data })
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
        cluster: '',
        deploying: false
      }
    },
    methods: {
      deleteService: function (event) {
        var projectId = this.$route.params.project_id
        var serviceId = this.$route.params.service_id
        axios({
          method: 'delete',
          url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/services/' + serviceId,
          headers: { 'Authorization': auth.getAuthHeader() }
        })
        .then(function (response) {
          console.log(response.data)
          router.push('/projects/' + projectId)
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      deployService: function (event) {
        this.deploying = true
        var projectId = this.$route.params.project_id
        var serviceId = this.$route.params.service_id
        axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters/' + this.service.cluster_id + '/deploy?service_id=' + serviceId, {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          console.log(response.data)
          router.push('/projects/' + projectId)
        })
        .catch(error => { console.log(error) })
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
