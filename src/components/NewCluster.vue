<template>
  <section class="box">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Register Cluster
          </h1>
        </div>
      </div>
    </section>
    <br/>
    <div class="field">
      <p class="title">
        Cluster name
      </p>
      <div class="control">
        <input class="input" name="name" type="text"v-model="name" placeholder="Cluster Name" v-validate.initial="'required|alpha_dash'">
        <p class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</p>
      </div>
    </div>
    <hr/>
    <div class="field">
      <p class="title">
        Cluster description
      </p>
      <div class="control">
        <input class="input" name="description" type="text"v-model="description" placeholder="Cluster description" v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('description')">{{ errors.first('description') }}</p>
      </div>
    </div>
    <hr/>
    <div class="field">
      <p class="title">
        Cluster endpoint
      </p>
      <div class="control">
        <input class="input" name="endpoint" type="text"v-model="endpoint" placeholder="Cluster endpoint" v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('endpoint')">{{ errors.first('endpoint') }}</p>
      </div>
    </div>
    <hr/>
    <div class="field">
      <p class="title">
        Cert
      </p>
      <div class="control">
        <input name="cert" type="file" @change='readCertFile("cert", $event)' v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('cert')">{{ errors.first('cert') }}</p>
      </div>
    </div>
    <hr/>
    <div class="field">
      <p class="title">
        Key
      </p>
      <div class="control">
        <input name="key" type="file" @change='readCertFile("key", $event)' v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('key')">{{ errors.first('key') }}</p>
      </div>
    </div>
    <hr/>
    <div class="field">
      <p class="title">
        Ca
      </p>
      <div class="control">
        <input name="ca" type="file" @change='readCertFile("ca", $event)' v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('ca')">{{ errors.first('ca') }}</p>
      </div>
    </div>
    <hr/>
    <button class="button is-primary" v-on:click="submit" :disabled="errors.any()">Register Cluster</button>
    <router-link class="button" :to='"/projects/"+this.$route.params.id'>Back</router-link>
  </section>
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
    methods: {
      readCertFile: function (cert, event) {
        var reader = new FileReader()
        var file = (event.target.files || event.dataTransfer.files)[0]
        reader.onload = (e) => {
          var fileContent = e.target.result
          if (cert === 'cert') {
            this.cert = fileContent
            return
          }
          if (cert === 'ca') {
            this.ca = fileContent
            return
          }
          if (cert === 'key') {
            this.key = fileContent
            return
          }
          console.log('Failed to read cert ' + cert)
        }
        reader.readAsBinaryString(file)
      },
      submit: function (event) {
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
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
