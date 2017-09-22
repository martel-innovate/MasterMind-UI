<template>
  <!-- start -->
  <section class="panel">
    <p class="panel-heading">
                 Register Cluster
               </p>
    <div class="field">
      <label class="label">Cluster name</label>
      <div class="control">
        <input class="input" type="text"v-model="name" placeholder="Cluster Name">
      </div>
    </div>
    <div class="field">
      <label class="label">Cluster description</label>
      <div class="control">
        <input class="input" type="text"v-model="description" placeholder="Cluster description">
      </div>
    </div>
    <div class="field">
      <label class="label">Cluster endpoint</label>
      <div class="control">
        <input class="input" type="text"v-model="endpoint" placeholder="Cluster endpoint">
      </div>
    </div>
    <div class="field">
      <label class="label">Cert</label>
      <div class="control">
        <textarea class="textarea" type="text"v-model="cert" placeholder="Cert"/>
      </div>
    </div>
    <div class="field">
      <label class="label">Key</label>
      <div class="control">
        <textarea class="textarea" type="text"v-model="key" placeholder="Key"/>
      </div>
    </div>
    <div class="field">
      <label class="label">Ca</label>
      <div class="control">
        <textarea class="textarea" type="text"v-model="ca" placeholder="Ca"/>
      </div>
    </div>
    <button class="button is-primary" v-on:click="submit">Register Cluster</button>
  </section>

  <!-- end -->
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'

  export default {
    name: 'new-project',
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
    methods: {
      submit: function (event) {
        var projectId = this.$route.params.id
        axios({
          method: 'post',
          url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/clusters',
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
