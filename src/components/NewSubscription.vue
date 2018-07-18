<template>
  <section class="box">
    <section class="hero is-primary">
      <div class="hero-body">
        <h1 class="title is-2">
          Register Subscription
        </h1>
      </div>
    </section>
    <br/>
    <div class="field">
      <p class="title">
        Subscription name
      </p>
      <p class="subtitle">
        The name to assign to this Subscription
      </p>
      <div class="control">
        <input class="input" name="name" type="text"v-model="name" placeholder="Subscription Name" v-validate.initial="'required|alpha_dash'">
        <p class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</p>
      </div>
    </div>
    <hr/>
    <div class="field">
      <p class="title">
        Subscription description
      </p>
      <p class="subtitle">
        A description to assign to this Subscription
      </p>
      <div class="control">
        <input class="input" name="description" type="text"v-model="description" placeholder="Subscription description" v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('description')">{{ errors.first('description') }}</p>
      </div>
    </div>
    <hr/>
    <div class="field">
      <p class="title">
        Subscription expires
      </p>
      <p class="subtitle">
        The expiration time for this Subscription in ISO 8601 format (e.g. 2017-12-13T13:51:34+00:00). Leave empty if sub does not expire
      </p>
      <div class="control">
        <input class="input" name="expires" type="text"v-model="expires" placeholder="Subscription expires">
      </div>
    </div>
    <hr/>
    <div class="field">
      <p class="title">
        Subscription throttling
      </p>
      <p class="subtitle">
        The throttling time of the Subscription in seconds
      </p>
      <div class="control">
        <input class="input" name="throttling" type="text"v-model="throttling" placeholder="Subscription throttling" v-validate.initial="'required|numeric'">
        <p class="text-danger" v-if="errors.has('throttling')">{{ errors.first('throttling') }}</p>
      </div>
    </div>
    <hr/>
    <div class="field">
      <!-- TODO: Expand -->
      <p class="title">
        Entities
      </p>
      <p class="subtitle">
        The Entities the Subscription refers to, ID and Type (e.g. Room1, Room). These can be patterns in the form of regular expressions (e.g. .* to match all ids/types).
      </p>
      <div class="control" v-for="(entity, i) in subject.entities" v>
        <label for="isIdPattern">Single</label>
        <input type="radio" id="isIdPattern" value="false" v-model="subject.entities[i]['isIdPattern']">
        <label for="isIdPattern">Pattern</label>
        <input type="radio" id="isIdPattern" value="true" v-model="subject.entities[i]['isIdPattern']">
        <input class="input" name="entityId" type="text"v-model="subject.entities[i]['id']" placeholder="Id" v-validate.initial="'required'">
        <label for="isTypePattern">Single</label>
        <input type="radio" id="isTypePattern" value="false" v-model="subject.entities[i]['isTypePattern']">
        <label for="isTypePattern">Pattern</label>
        <input type="radio" id="isTypePattern" value="true" v-model="subject.entities[i]['isTypePattern']">
        <input class="input" name="entityType" type="text"v-model="subject.entities[i]['type']" placeholder="Type" v-validate.initial="'required'">
        <hr/>
      </div>
      <button class="button is-primary" v-on:click="subject.entities.push({isIdPattern: false, isTypePattern: false})">+ Add Entity</button>
      <p class="text-danger" v-if="errors.has('entityId')">{{ errors.first('entityId') }}</p>
      <p class="text-danger" v-if="errors.has('entityType')">{{ errors.first('entityType') }}</p>
    </div>
    <hr/>
    <div class="field">
      <!-- TODO: Expand -->
      <p class="title">
        Conditions
      </p>
      <p class="subtitle">
        The Conditions the notification triggers on (e.g. temperature, pressure, ...)
      </p>
      <div class="control" v-for="(condition, i) in subject.condition.attrs" v>
        <input class="input" name="condition" type="text"v-model="subject.condition.attrs[i]" placeholder="Value" v-validate.initial="'required'">
      </div>
      <button class="button is-primary" v-on:click="subject.condition.attrs.push('')">+ Add Condition</button>
      <p class="text-danger" v-if="errors.has('condition')">{{ errors.first('condition') }}</p>
    </div>
    <hr/>
    <span class="field">
      <!-- Creates a dropdown of the services registered to this project, to select one as the broker for the subs -->
      <!-- TODO: Should onyl display context broker services -->
      <p class="title">
        Subscription Service
      </p>
      <p class="subtitle">
        The Context Broker Service to register this Subscription to
      </p>
      <select v-model="service_id">
        <option v-for="service in services" v-bind:value="service.id">
          {{ service.name }}
        </option>
      </select>
    </span>
    <hr/>
    <span class="field">
      <!-- Creates a dropdown of the services registered to this project, to select one as endpoint of notifications -->
      <!-- TODO: Perhaps filter to only have appropriate endpoints? -->
      <p class="title">
        Notification Endpoint
      </p>
      <p class="subtitle">
        The endpoint Service of the Notifications for this Subscription (e.g. http://192.168.99.100:8668/v2/notify)
      </p>
      <input class="input" name="notification_endpoint" type="text" v-model="notification['http']['url']" placeholder="Notification endpoint" v-validate.initial="'required'">
      <p class="text-danger" v-if="errors.has('notification_endpoint')">{{ errors.first('notification_endpoint') }}</p>
    </span>
    <hr/>
    <div class="field">
      <p class="title">
        Notification Attributes
      </p>
      <p class="subtitle">
        The attributes to send in notifications (e.g. temperature, pressure, ...). Don't specify any attributes to send all of them.
      </p>
      <div class="control" v-for="(att, i) in notification.attrs" v>
        <input class="input" name="notificationAttr" type="text"v-model="notification.attrs[i]" placeholder="Value" v-validate.initial="'required'">
      </div>
      <button class="button is-primary" v-on:click="notification.attrs.push('')">+ Add Attribute</button>
      <p class="text-danger" v-if="errors.has('notificationAttr')">{{ errors.first('notificationAttr') }}</p>
    </div>
    <hr/>
    <span class="field">
      <p class="title">
        Notification Metadata
      </p>
      <p class="subtitle">
        Metadata to filter for in the notifcations (none for no filtering)
      </p>
      <div class="control" v-for="(metadata, i) in notification.metadata" v>
        <input class="input" name="metadata" type="text"v-model="notification.metadata[i]" placeholder="Value" v-validate.initial="'required'">
      </div>
      <button class="button is-primary" v-on:click="notification.metadata.push('')">+ Add Metadata</button>
      <p class="text-danger" v-if="errors.has('metadata')">{{ errors.first('metadata') }}</p>
    </span>
    <hr/>
    <router-link class="button is-medium" :to='"/projects/"+this.$route.params.id+"/subscriptions"'>Back</router-link>
    <button class="button is-medium is-primary" v-on:click="submit" :disabled="errors.any() || service_id === 0">New Subscription</button>
  </section>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'

  // Function to check if a given string parses to a valid JSON
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
  // Add to validator
  VeeValidate.Validator.extend('checkIfValidJson', checkIfValidJson)

  Vue.use(VeeValidate)

  export default {
    created () {
      // Get services of this project
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/services', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.services = response.data
        this.service_id = this.services[0].id
      })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        name: '',
        description: '',
        subject: {entities: [{isIdPattern: false, isTypePattern: false}], condition: {attrs: []}},
        notification: {http: {url: ''}, metadata: [], attrs: []},
        expires: '',
        throttling: '',
        service_id: 0,
        services: []
      }
    },
    methods: {
      // Submit new sub
      submit: function (event) {
        // Return if form not valid
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
        // Set this outside of axios functions
        var projectId = this.$route.params.id
        // Check if expiration was provided, set to "never" if not so
        var expires = this.expires
        if (expires === '') {
          expires = 'never'
        }
        for (var i = 0; i < this.subject.entities.length; i++) {
          var e = {}
          if (this.subject.entities[i].isIdPattern === 'true') {
            e.idPattern = this.subject.entities[i].id
          } else {
            e.id = this.subject.entities[i].id
          }
          if (this.subject.entities[i].isTypePattern === 'true') {
            e.typePattern = this.subject.entities[i].type
          } else {
            e.type = this.subject.entities[i].type
          }
          this.subject.entities[i] = e
        }
        // POST to API
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
            expires: expires,
            throttling: this.throttling,
            service_id: this.service_id,
            // Subs start unregistered by default
            status: 'unregistered'
          }
        })
        .then(function (response) {
          console.log(response.data)
          router.push('/projects/' + projectId + '/subscriptions')
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
