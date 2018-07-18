<template>
  <div class="box">
    <section class="hero is-primary">
      <div class="hero-body">
        <h1 class="title is-2">
          Edit Cluster
        </h1>
      </div>
    </section>
    <br/>
    <div id="cluster">
      <p class="title">
        Description
      </p>
      <p class="control">
        <input class="input" name="name" type="text" v-model="name" v-validate.initial="'required|alpha_dash'">
        <p class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</p>
      </p>
      <hr/>
      <p class="title">
        Cluster Description
      </p>
      <p class="control">
        <input class="input" name="description" type="text" v-model="description" v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('description')">{{ errors.first('description') }}</p>
      </p>
      <hr/>
      <p class="title">
        Cluster Endpoint
      </p>
      <p class="control">
        <input class="input" name="endpoint" type="text" v-model="endpoint" v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('endpoint')">{{ errors.first('endpoint') }}</p>
      </p>
      <hr/>
      <p class="title">
        Cert
      </p>
      <p class="control">
        <textarea class="textarea" name="cert" rows="4" cols="50" v-model="cert" v-validate.initial="'required'"/>
        <p class="text-danger" v-if="errors.has('cert')">{{ errors.first('cert') }}</p>
      </p>
      <hr/>
      <p class="title">
        Key
      </p>
      <p class="control">
        <textarea class="textarea" name="key" rows="4" cols="50" v-model="key" v-validate.initial="'required'"/>
        <p class="text-danger" v-if="errors.has('key')">{{ errors.first('key') }}</p>
      </p>
      <hr/>
      <p class="title">
        Ca
      </p>
      <p class="control">
        <textarea class="textarea" name="ca" rows="4" cols="50" v-model="ca" v-validate.initial="'required'"/>
        <p class="text-danger" v-if="errors.has('ca')">{{ errors.first('ca') }}</p>
      </p>
      <hr/>
      <router-link class="button is-medium" :to='"/projects/"+this.$route.params.project_id+"/clusters/"'>Back</router-link>
      <button class="button is-primary is-medium" v-on:click="submit" :disabled="errors.any()">Edit Cluster</button>
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
      // Get Cluster data
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
      // Submit cluster edit
      submit: function (event) {
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
        // Setting this otuside of axios function
        var projectId = this.$route.params.project_id
        // Send PUT to the API
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
          router.push('/projects/' + projectId + '/clusters')
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
