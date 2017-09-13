<template>
  <div class="register-service">
    <h1>Register Service</h1>
    <form id="service">
      <p>
        Configuration:
        <textarea v-model="configuration" placeholder="Environment variables (JSON format)"></textarea>
      </p>
      <p>
        <input type="radio" id="one" value="true" v-model="managed">
        <label for="one">Managed</label>
        <input type="radio" id="two" value="false" v-model="managed">
        <label for="two">Unmanaged</label>
      </p>
      <p>
        Latitude: <input type="text" v-model="latitude">
      </p>
      <p>
        Longitude: <input type="text" v-model="longitude">
      </p>
      <p>
        <select v-model="service_type_id">
          <option disabled value="">Select a service type</option>
          <option v-for="service_type in service_types" v-bind:value="service_type.id">
            {{ service_type.name }}
          </option>
        </select>
      </p>
      <p>
        <select v-model="cluster_id">
          <option disabled value="">Select a cluster</option>
          <option v-for="cluster in clusters" v-bind:value="cluster.id">
            {{ cluster.name }}
          </option>
        </select>
      </p>
      <button v-on:click="submit">Register Service</button>
    </form>
  </div>
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
    },
    data () {
      return {
        configuration: '',
        status: 'inactive',
        managed: 'false',
        endpoint: '',
        latitude: 0,
        longitude: 0,
        service_type_id: 0,
        docker_service_id: '',
        cluster_id: 1,
        service_types: [],
        clusters: []
      }
    },
    methods: {
      submit: function (event) {
        var projectId = this.$route.params.id
        axios({
          method: 'post',
          url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/services',
          headers: { 'Authorization': auth.getAuthHeader() },
          data: {
            service_type_id: this.service_type_id,
            configuration: this.configuration,
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

  a {
    color: #42b983;
  }
</style>
