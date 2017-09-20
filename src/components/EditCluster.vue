<template>
  <div class="edit-cluster">
    <h1>Edit Cluster</h1>
    <form id="cluster">
      <p>
        Cluster Name: <input type="text" v-model="name">
      </p>
      <p>
        Cluster Description: <input type="text" v-model="description">
      </p>
      <p>
        Cluster Endpoint: <input type="text" v-model="endpoint">
      </p>
      <p>
        Cert: <textarea rows="4" cols="50" v-model="cert"/>
      </p>
      <p>
        Key: <textarea rows="4" cols="50" v-model="key"/>
      </p>
      <p>
        Ca: <textarea rows="4" cols="50" v-model="ca"/>
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
    name: 'edit-cluster',
    data () {
      return {
        name: '',
        description: '',
        endpoint: '',
        cert: '',
        key: '',
        ca: ''
      }
    },
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/clusters/' + this.$route.params.cluster_id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.name = response.data.name
        this.description = response.data.description
        this.endpoint = response.data.endpoint
        this.cert = response.data.cert
        this.key = response.data.key
        this.ca = response.data.ca
      })
      .catch(error => { console.log(error) })
    },
    methods: {
      submit: function (event) {
        var projectId = this.$route.params.project_id
        axios({
          method: 'put',
          url: auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/clusters/' + this.$route.params.cluster_id,
          headers: { 'Authorization': auth.getAuthHeader() },
          data: {
            name: this.name,
            description: this.description,
            endpoint: this.endpoint,
            cert: this.cert,
            key: this.key,
            ca: this.ca
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
