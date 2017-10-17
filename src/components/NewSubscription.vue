<template>
  <!-- start -->
  <section class="panel">
    <p class="panel-heading">
      Register Subscription
    </p>
    <div class="field">
      <label class="label">Subscription name</label>
      <div class="control">
        <input class="input" name="name" type="text"v-model="name" placeholder="Subscription Name" v-validate.initial="'required|alpha_dash'">
        <p class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</p>
      </div>
    </div>
    <div class="field">
      <label class="label">Subscription description</label>
      <div class="control">
        <input class="input" name="description" type="text"v-model="description" placeholder="Subscription description" v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('description')">{{ errors.first('description') }}</p>
      </div>
    </div>
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
    <hr/>
    <div class="field">
      <p>
        Entities
      </p>
      <div class="control" v-for="(entity, i) in subject.entities" v>
        <input class="input" name="entityId" type="text"v-model="subject.entities[i]['id']" placeholder="Id" v-validate.initial="'required'">
        <input class="input" name="entityType" type="text"v-model="subject.entities[i]['type']" placeholder="Type" v-validate.initial="'required'">
      </div>
      <button class="button is-primary" v-on:click="subject.entities.push({})">+</button>
      <p class="text-danger" v-if="errors.has('entityId')">{{ errors.first('entityId') }}</p>
      <p class="text-danger" v-if="errors.has('entityType')">{{ errors.first('entityType') }}</p>
    </div>
    <hr/>
    <div class="field">
      <p>
        Condition
      </p>
      <div class="control" v-for="(condition, i) in subject.condition.attrs" v>
        <input class="input" name="condition" type="text"v-model="subject.condition.attrs[i]" placeholder="Value" v-validate.initial="'required'">
      </div>
      <button class="button is-primary" v-on:click="subject.condition.attrs.push('')">+</button>
      <p class="text-danger" v-if="errors.has('condition')">{{ errors.first('condition') }}</p>
    </div>
    <hr/>
    <span class="field">
      <p>
        Subscription Service
      </p>
      <select v-model="service_id">
        <option v-for="service in services" v-bind:value="service.id">
          {{ service.name }}
        </option>
      </select>
    </span>
    <hr/>
    <span class="field">
      <p>
        Notification endpoint
      </p>
      <select v-model="notification['http']['url']">
        <option v-for="service in services" v-bind:value="'http://'+service.endpoint">
          {{ service.name }}
        </option>
      </select>
    </span>
    <hr/>
    <br/>
    <button class="button is-primary" v-on:click="submit" :disabled="errors.any() || service_id === 0">New Subscription</button>
    <router-link class="button" :to='"/projects/"+this.$route.params.id'>Back</router-link>
  </section>

  <!-- end -->
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
    name: 'new-project',
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/services', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.services = response.data
        this.service_id = this.services[0].id
        this.notification.http.url = 'http://' + this.services[0].endpoint
      })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        name: '',
        description: '',
        subject: {entities: [{}], condition: {attrs: ['']}},
        notification: {http: {url: ''}},
        expires: '',
        throttling: '',
        service_id: 0,
        services: []
      }
    },
    methods: {
      submit: function (event) {
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
        var projectId = this.$route.params.id
        axios({
          method: 'post',
          url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions',
          headers: { 'Authorization': auth.getAuthHeader() },
          data: {
            subscription_id: 'pending',
            name: this.name,
            description: this.description,
            subject: JSON.stringify(this.subject),
            notification: JSON.stringify(this.notification),
            expires: this.expires,
            throttling: this.throttling,
            service_id: this.service_id,
            status: 'inactive'
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
