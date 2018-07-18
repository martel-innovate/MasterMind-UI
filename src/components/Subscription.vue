<template>
  <div class="box is-fullwidth">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-2">
            {{subscription.name}}
          </h1>
          <h2 class="subtitle is-4">
            {{subscription.status}}
          </h2>
        </div>
      </div>
    </section>
    <br/>
    <p class="title">
      Description
    </p>
    <p class="subtitle">
      {{subscription.description}}
    </p>
    <hr/>
    <p class="title">
      Expires
    </p>
    <p class="subtitle">
      {{subscription.expires}}
    </p>
    <hr/>
    <p class="title">
      Throttling
    </p>
    <p class="subtitle">
      {{subscription.throttling}}
    </p>
    <hr/>
    <div>
      <!-- Show JSON or formatted list, depending on set toggled variable -->
      <div v-show="!showJSON">
        <div v-if="subscription.subject">
          <p class="title">
            Entities
          </p>
          <p v-for="entity in subscription.subject.entities" class="subtitle">
            {{ entity.id }}, {{ entity.type }}
          </p>
        </div>
        <hr/>
        <div v-if="subscription.subject">
          <p class="title">
            Condition
          </p>
          <p v-for="attr in subscription.subject.condition.attrs" class="subtitle">
            {{ attr }}
          </p>
        </div>
      </div>
      <div v-show="showJSON">
        <p>
          <code style="white-space: pre-wrap">{{subscription.subject}}</code>
        </p>
      </div>
    </div>
    <hr/>
    <div>
      <div v-show="!showJSON">
        <p class="title">
          Notification endpoint
        </p>
        <p class="subtitle" v-if="subscription.notification">
          {{subscription.notification.http.url}}
        </p>
        </p>
      </div>
      <div v-show="showJSON">
        <p>
          <code style="white-space: pre-wrap">{{subscription.notification}}</code>
        </p>
      </div>
    </div>
    <hr/>
    <!-- Toggle between JSON and formatted data -->
    <button class="button" v-show="!showJSON" v-on:click="showJSON = true">Show JSON</button>
    <button class="button" v-show="showJSON" v-on:click="showJSON = false">Hide JSON</button>
    <hr/>
    <div class="panel-block">
      <router-link class="button" :to='"/projects/"+this.$route.params.project_id+"/subscriptions"'>Back</router-link>
      <router-link class="button" :to='"/projects/"+this.$route.params.project_id+"/subscriptions/"+subscription.id+"/edit"'>Edit Subscription</router-link>
      <!-- Show register, activate or deactivate buttons depending on sub status -->
      <button class="button is-primary" v-show="this.subscription.subscription_id === 'pending'" v-on:click="registerSubscription"><b>Activate Subscription</b></button>
      <button class="button is-primary" v-show="this.subscription.subscription_id !== 'pending' && this.subscription.status === 'inactive'" v-on:click="activateSubscription"><b>Activate Subscription</b></button>
      <button class="button is-primary" v-show="this.subscription.subscription_id !== 'pending' && this.subscription.status === 'active'" v-on:click="deactivateSubscription"><b>Deactivate Subscription</b></button>
      <button v-on:click="deleteSubscription" class="button is-danger">Delete</button>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  export default {
    created () {
      // Get Sub
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/ngsi_subscriptions/' + this.$route.params.subscription_id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.subscription = response.data
        // Parse JSONs for subject and notification into objects
        this.subscription.subject = JSON.parse(this.subscription.subject)
        this.subscription.notification = JSON.parse(this.subscription.notification)
      })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        subscription: {},
        showJSON: false
      }
    },
    methods: {
      // Register Subscription to Broker
      registerSubscription: function (event) {
        var projectId = this.$route.params.project_id
        var subscriptionId = this.subscription.id
        // Send request to API to register sub
        axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/register', {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          console.log(response.data)
          location.reload()
        })
        .catch(error => { console.log(error) })
      },
      // Actovate Subscription on Broker
      activateSubscription: function (event) {
        // Setting this outside of axios
        var projectId = this.$route.params.project_id
        var subscriptionId = this.subscription.id
        // Send request to API to activate sub
        axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/activate', {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          console.log(response.data)
          location.reload()
        })
        .catch(error => { console.log(error) })
      },
      // Deactivate Subscription on Broker
      deactivateSubscription: function (event) {
        // Setting this outside of axios
        var projectId = this.$route.params.project_id
        var subscriptionId = this.subscription.id
        // Send request to API to deactivate Sub
        axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/deactivate', {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          console.log(response.data)
          location.reload()
        })
        .catch(error => { console.log(error) })
      },
      // Delete the Subscription
      deleteSubscription: function (event) {
        // Setting this outside of axios
        var projectId = this.$route.params.project_id
        var subscriptionId = this.subscription.id
        var subId = this.subscription.subscription_id
        // Confirmation dialog
        this.$dialog.confirm('Are you sure you want to delete the Subscription?', {okText: 'DELETE', cancelText: 'CANCEL'})
        .then(function () {
          // If Sub is registered on the broker, remove it
          if (subId !== 'pending') {
            // Send request to API to remove the sub from the broker
            axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/remove', {headers: {'Authorization': auth.getAuthHeader()}})
            .then(response => {
              console.log(response.data)
            })
            .catch(error => { console.log(error) })
          }
          // DELETE to API
          axios({
            method: 'delete',
            url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId,
            headers: { 'Authorization': auth.getAuthHeader() }
          })
          .then(function (response) {
            console.log(response.data)
            router.push('/projects/' + projectId + '/subscriptions')
          })
          .catch(function (error) {
            console.log(error)
          })
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
