<template>
  <div class="edit-service">
    <h1>Edit Service</h1>
    <form id="service">
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
      <button v-on:click="submit">Edit Cluster</button>
    </form>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'

  export default {
    name: 'edit-service',
    data () {
      return {
        managed: false,
        latitude: '',
        longitude: ''
      }
    },
    methods: {
      submit: function (event) {
        var projectId = this.$route.params.project_id
        var serviceId = this.$route.params.service_id
        axios({
          method: 'put',
          url: auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/services/' + this.$route.params.service_id,
          headers: { 'Authorization': auth.getAuthHeader() },
          data: {
            managed: this.managed,
            latitude: this.latitude,
            longitude: this.longitude
          }
        })
        .then(function (response) {
          console.log(response.data)
          router.push('/projects/' + projectId + '/services/' + serviceId)
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
