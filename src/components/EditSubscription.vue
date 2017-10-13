<template>
  <div class="panel-block">
    <p class="panel-heading">Edit Subscription</h1>
    <div id="cluster">
      <p class="control">
        Subscription Name: <input class="input" name="name" type="text" v-model="name" v-validate.initial="'required|alpha_dash'">
        <p class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</p>
      </p>
      <p class="control">
        Subscription Description: <input class="input" name="description" type="text" v-model="description" v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('description')">{{ errors.first('description') }}</p>
      </p>
      <div class="field">
        <label class="label">Subscription expires</label>
        <div class="control">
          <input class="input" name="expires" type="text"v-model="expires" placeholder="Subscription expires" v-validate.initial="'required'">
          <p class="text-danger" v-if="errors.has('expires')">{{ errors.first('expires') }}</p>
        </div>
      </div>
      <div class="field">
        <label class="label">Subscription throttling</label>
        <div class="control">
          <input class="input" name="throttling" type="text"v-model="throttling" placeholder="Subscription throttling" v-validate.initial="'required|numeric'">
          <p class="text-danger" v-if="errors.has('throttling')">{{ errors.first('throttling') }}</p>
        </div>
      </div>
      <div class="field">
        <label class="label">Subscription subject</label>
        <div class="control">
          <textarea class="textarea" name="subject" rows="4" cols="50" v-model="subject" v-validate.initial="'required|checkIfValidJson'"/>
          <p class="text-danger" v-if="errors.has('subject')">{{ errors.first('subject') }}</p>
        </div>
      </div>
      <div class="field">
        <label class="label">Subscription notification</label>
        <div class="control">
          <textarea class="textarea" name="notification" rows="4" cols="50" v-model="notification" v-validate.initial="'required|checkIfValidJson'"/>
          <p class="text-danger" v-if="errors.has('notification')">{{ errors.first('notification') }}</p>
        </div>
      </div>
      <button class="button is-primary" v-on:click="submit" :disabled="errors.any()">Edit Subscription</button>
      <router-link class="button" :to='"/projects/"+this.$route.params.project_id+"/subscriptions/"+this.$route.params.subscription_id'>Back</router-link>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'

  const checkIfValidJson = {
    getMessage (field, args) {
      return 'Invalid JSON format'
    },
    validate (value) {
      try {
        JSON.parse(value)
        return true
      } catch (err) {
        return false
      }
    }
  }
  VeeValidate.Validator.extend('checkIfValidJson', checkIfValidJson)

  Vue.use(VeeValidate)

  export default {
    name: 'edit-subscription',
    data () {
      return {
        name: '',
        description: '',
        subject: '',
        notification: '',
        expires: '',
        throttling: ''
      }
    },
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/ngsi_subscriptions/' + this.$route.params.subscription_id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.name = response.data.name
        this.description = response.data.description
        this.subject = response.data.subject
        this.notification = response.data.notification
        this.expires = response.data.expires
        this.throttling = response.data.throttling
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
          url: auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/ngsi_subscriptions/' + this.$route.params.subscription_id,
          headers: { 'Authorization': auth.getAuthHeader() },
          data: {
            name: this.name,
            description: this.description,
            subject: this.subject,
            notification: this.notification,
            expires: this.expires,
            throttling: this.throttling
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
