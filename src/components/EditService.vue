<template>
  <div class="panel-block">
    <p class="panel-heading">Edit Service</p>
      <p class="control">
        <input type="radio" id="one" value="true" v-model="managed">
        <label class="radio" for="one">Managed</label>
        <input type="radio" id="two" value="false" v-model="managed">
        <label class="radio" for="two">Unmanaged</label>
      </p>
      <p class="control">
        Latitude: <input class="input" name="latitude" type="text" v-model="latitude" v-validate.initial="'required|numeric'">
        <p class="text-danger" v-if="errors.has('latitude')">{{ errors.first('latitude') }}</p>
      </p>
      <p>
        Longitude: <input class="input" name="longitude" type="text" v-model="longitude" v-validate.initial="'required|numeric'">
        <p class="text-danger" v-if="errors.has('longitude')">{{ errors.first('longitude') }}</p>
      </p>
      <button class="button is-primary" v-on:click="submit" :disabled="errors.any()">Edit Cluster</button>
      <router-link class="button" :to='"/projects/"+this.$route.params.project_id+"/services/"+this.$route.params.service_id'>Back</router-link>
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
    name: 'edit-service',
    data () {
      return {
        managed: false,
        latitude: '',
        longitude: ''
      }
    },
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/services/' + this.$route.params.service_id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.managed = response.data.managed
        this.latitude = response.data.latitude
        this.longitude = response.data.longitude
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
