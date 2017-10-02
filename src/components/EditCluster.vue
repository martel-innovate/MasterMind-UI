<template>
  <div class="panel-block">
    <p class="panel-heading">Edit Cluster</h1>
    <div id="cluster">
      <p class="control">
        Cluster Name: <input class="input" name="name" type="text" v-model="name" v-validate.initial="'required|alpha_dash'">
        <p class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</p>
      </p>
      <p class="control">
        Cluster Description: <input class="input" name="description" type="text" v-model="description" v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('description')">{{ errors.first('description') }}</p>
      </p>
      <p class="control">
        Cluster Endpoint: <input class="input" name="endpoint" type="text" v-model="endpoint" v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('endpoint')">{{ errors.first('endpoint') }}</p>
      </p>
      <p class="control">
        Cert: <textarea class="textarea" name="cert" rows="4" cols="50" v-model="cert" v-validate.initial="'required'"/>
        <p class="text-danger" v-if="errors.has('cert')">{{ errors.first('cert') }}</p>
      </p>
      <p class="control">
        Key: <textarea class="textarea" name="key" rows="4" cols="50" v-model="key" v-validate.initial="'required'"/>
        <p class="text-danger" v-if="errors.has('key')">{{ errors.first('key') }}</p>
      </p>
      <p class="control">
        Ca: <textarea class="textarea" name="ca" rows="4" cols="50" v-model="ca" v-validate.initial="'required'"/>
        <p class="text-danger" v-if="errors.has('ca')">{{ errors.first('ca') }}</p>
      </p>
      <button class="button is-primary" v-on:click="submit" v-if="errors.any()" disabled>Edit Cluster</button>
      <button class="button is-primary" v-on:click="submit" v-if="!errors.any()">Edit Cluster</button>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'

  Vue.use(VeeValidate)

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
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
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
