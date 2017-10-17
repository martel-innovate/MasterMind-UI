<template>
  <div class="section is-fullwidth">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{subscription.name}}
          </h1>
          <h2 class="subtitle">
            {{subscription.subscription_id}}, {{subscription.status}}
          </h2>
        </div>
      </div>
    </section>
    <br/>
    <div class="box is-fullwidth">
      <p>
        Description: {{subscription.description}}
      </p>
    </div>
    <div class="box is-fullwidth">
      <p>
        Expires: {{subscription.expires}}
      </p>
    </div>
    <div class="box is-fullwidth">
      <p>
        Throttling: {{subscription.throttling}}
      </p>
    </div>
    <div class="box is-fullwidth">
      <p>
        Subject:
      </p>
      <p>
        <code style="white-space: pre-wrap">{{subscription.subject}}</code>
      </p>
    </div>
    <div class="box is-fullwidth">
      <p>
        Notification:
      </p>
      <p>
        <code style="white-space: pre-wrap">{{subscription.notification}}</code>
      </p>
    </div>
    <div class="panel-block">
      <button class="button is-primary" v-show="this.subscription.subscription_id === 'pending'" v-on:click="registerSubscription"><b>Register Subscription</b></button>
      <button class="button is-primary" v-show="this.subscription.subscription_id !== 'pending' && this.subscription.status === 'inactive'" v-on:click="activateSubscription"><b>Activate Subscription</b></button>
      <button class="button is-primary" v-show="this.subscription.subscription_id !== 'pending' && this.subscription.status === 'active'" v-on:click="deactivateSubscription"><b>Deactivate Subscription</b></button>
    </div>
    <div class="panel-block">
      <router-link class="button" :to='"/projects/"+this.$route.params.project_id+"/subscriptions/"+subscription.id+"/edit"'>Edit Subscription</router-link>
      <button v-on:click="deleteSubscription" class="button is-danger">Delete</button>
    </div>
    <div class="panel-block">
       <router-link class="button" :to='"/projects/"+this.$route.params.project_id'>Back</router-link>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  export default {
    name: 'subscription',
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/ngsi_subscriptions/' + this.$route.params.subscription_id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.subscription = response.data })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        subscription: {}
      }
    },
    methods: {
      registerSubscription: function (event) {
        var projectId = this.$route.params.project_id
        var subscriptionId = this.subscription.id
        axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/register', {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          console.log(response.data)
          location.reload()
        })
        .catch(error => { console.log(error) })
      },
      activateSubscription: function (event) {
        var projectId = this.$route.params.project_id
        var subscriptionId = this.subscription.id
        axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/activate', {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          console.log(response.data)
          location.reload()
        })
        .catch(error => { console.log(error) })
      },
      deactivateSubscription: function (event) {
        var projectId = this.$route.params.project_id
        var subscriptionId = this.subscription.id
        axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/deactivate', {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => {
          console.log(response.data)
          location.reload()
        })
        .catch(error => { console.log(error) })
      },
      deleteSubscription: function (event) {
        var projectId = this.$route.params.project_id
        var subscriptionId = this.subscription.id
        var subId = this.subscription.subscription_id

        if (subId !== 'pending') {
          axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/remove', {headers: {'Authorization': auth.getAuthHeader()}})
          .then(response => {
            console.log(response.data)
          })
          .catch(error => { console.log(error) })
        }

        axios({
          method: 'delete',
          url: auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/ngsi_subscriptions/' + this.$route.params.subscription_id,
          headers: { 'Authorization': auth.getAuthHeader() }
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
