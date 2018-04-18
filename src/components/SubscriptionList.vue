<template>
<div class="box is-fullwidth">
  <section class="hero is-primary">
    <div class="hero-body has-text-centered">
      <h1 class="title">
        {{project.name}} Subscriptions
      </h1>
      <h2 class="subtitle">
        The NGSI Subscriptions registered in this project
      </h2>
    </div>
  </section>
  <br/>
  <router-link class="button" :to='"/projects/"+$route.params.id'>Back</router-link>
  <!-- Search box -->
  <input class="is-pulled-right" v-model="searchQuery" placeholder="Search...">
  <hr/>
  <table class="table">
    <thead>
      <tr class="subtitle">
        <td>
          <input type="checkbox" v-model="allChecked" @click="checkAll">
        </td>
        <td>Name</td>
        <td>Endpoint</td>
        <td>Service</td>
        <td>Entities</td>
        <td>Attributes</td>
        <td>Status</td>
        <td>Actions</td>
      </tr>
    </thead>
    <tbody>
      <!-- TList subs, filtered by the search query -->
      <tr v-for="subscription in filterSubscriptions(subscriptions, searchQuery)">
        <td>
          <!-- Checkbox to select subscription -->
          <input type="checkbox" v-model="subscription['checked']">
        </td>
        <td>
          <router-link :to='"/projects/"+$route.params.id+"/subscriptions/"+subscription.id'>{{subscription.name}}</router-link>
        </td>
        <td>
          {{subscription.notification.http.url}}
        </td>
        <td>
          <router-link v-if="getServiceName(subscription.service_id)" :to='"/projects/"+$route.params.id+"/services/"+subscription.service_id'>{{getServiceName(subscription.service_id).name}}</router-link>
        </td>
        <td>
          <p v-for="entity in subscription.subject.entities">
            {{entity.idPattern}}, {{entity.typePattern}}
          </p>
        </td>
        <td>
          <p v-for="condition in subscription.subject.condition.attrs">
            {{condition}}
          </p>
        </td>
        <td>
          {{subscription.status}}
        </td>
        <td>
          <!-- Button to see sub details -->
          <span class="button" v-tooltip="'View Subscription details'">
            <i class="fa fa-eye" v-on:click='subscriptionDetails(subscription.id)'></i>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
  <hr/>
  <!-- Buttons to act upon the selected subs, either displayed or shown as a loading circle if an action is in progress -->
  <button v-if="!buttonsActive" class="button is-loading" disabled></button>
  <button v-if="!buttonsActive" class="button is-loading" disabled></button>
  <button v-if="!buttonsActive" class="button is-danger is-loading" disabled></button>
  <button v-if="buttonsActive" class="button" v-on:click="activateSubscription"><b>Activate</b></button>
  <button v-if="buttonsActive" class="button" v-on:click="deactivateSubscription"><b>Deactivate</b></button>
  <button v-if="buttonsActive" class="button is-danger" v-on:click="deleteSubscription"><b>Delete</b></button>
  <hr/>
  <router-link class="button is-primary" :to='"/projects/"+$route.params.id+"/subscriptions/new"'>Register Subscription</router-link>
</div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  export default {
    created () {
      // Get project
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.project = response.data })
      .catch(error => { console.log(error) })
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/services', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.services = response.data
        console.log(this.services)
      })
      .catch(error => { console.log(error) })
      // Get subs
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/ngsi_subscriptions', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.subscriptions = response.data
        // Sort subs by id
        this.subscriptions.sort(function (a, b) {
          return a.service_id - b.service_id
        })
        // Parse JSONs for each sub, and set them unchecked by default
        this.subscriptions.forEach(function (subscription) {
          subscription.subject = JSON.parse(subscription.subject)
          subscription.notification = JSON.parse(subscription.notification)
          subscription.checked = false
        })
        console.log(this.subscriptions)
      })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        project: {},
        services: [],
        subscriptions: [],
        searchQuery: '',
        checked: {},
        allChecked: false,
        buttonsActive: true
      }
    },
    methods: {
      // Redirect to sub details for given sub
      subscriptionDetails: function (subscription) {
        router.push('/projects/' + this.$route.params.id + '/subscriptions/' + subscription)
      },
      // Get the name of a service based on the id of the service within the sub
      getServiceName: function (subscriptionId) {
        return this.services.find(function (service) {
          return service.id === subscriptionId
        })
      },
      // Filter subscriptions by name
      filterSubscriptions: function (subscriptions, searchQuery) {
        return subscriptions.filter(function (subscription) {
          return subscription.name.includes(searchQuery)
        })
      },
      // Set all subs as checked
      checkAll: function () {
        // Filter subs before making the checks
        var filteredSubs = this.filterSubscriptions(this.subscriptions, this.searchQuery)
        // If the check all box is ticked, set all visible subs as selected, if not uncheck them
        if (this.allChecked) {
          filteredSubs.forEach(function (subscription) {
            subscription.checked = true
          })
        } else {
          filteredSubs.forEach(function (subscription) {
            subscription.checked = false
          })
        }
      },
      // Activate selected subs
      activateSubscription: function (event) {
        // Deactivate buttons
        this.buttonsActive = false
        // Set this outside of axios functions
        var projectId = this.$route.params.id
        // Promise list for axios promises
        var promises = []
        // For each sub, activate it
        this.subscriptions.forEach(function (subscription) {
          var subscriptionId = subscription.id
          // If checked, and inactive, try activating
          if (subscription.checked && subscription.status === 'inactive') {
            promises.push(
              axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/activate', {headers: {'Authorization': auth.getAuthHeader()}})
            )
          // If checked, and unregistered, try activating
          } else if (subscription.checked && subscription.status === 'unregistered') {
            promises.push(
              axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/register', {headers: {'Authorization': auth.getAuthHeader()}})
            )
          }
        })
        // Await fulfillment of all promises
        axios.all(promises)
        .then(response => {
          console.log(response)
          location.reload()
        })
        .catch(error => {
          // TODO: Allert goes here
          console.log(error)
          this.buttonsActive = true
        })
      },
      // Deactivate all subs
      deactivateSubscription: function (event) {
        // Deactivate buttons
        this.buttonsActive = false
        // Set this outside of axios functions
        var projectId = this.$route.params.id
        // List of axios promises
        var promises = []
        // For each subscription, attempt deactivating
        this.subscriptions.forEach(function (subscription) {
          // If sub active, deactivate
          if (subscription.checked && subscription.status === 'active') {
            var subscriptionId = subscription.id
            promises.push(
              axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/deactivate', {headers: {'Authorization': auth.getAuthHeader()}})
            )
          }
        })
        // Await fullfilment of all promises
        axios.all(promises)
        .then(response => {
          console.log(response)
          location.reload()
        })
        .catch(error => {
          console.log(error)
          this.buttonsActive = true
        })
      },
      // Delete subs
      deleteSubscription: function () {
        // Deactivate buttons
        this.buttonsActive = false
        // Set this outside of axios functions
        var projectId = this.$route.params.id
        // List of axios promises
        var promises = []
        // For each sub, delete
        this.subscriptions.forEach(function (subscription) {
          // Check if checked
          if (subscription.checked) {
            // Set this outside of axios functions
            var subscriptionId = subscription.id
            var subId = subscription.subscription_id
            // If sub is not pending, remove it from broker
            if (subId !== 'pending') {
              promises.push(
                axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/remove', {headers: {'Authorization': auth.getAuthHeader()}})
                .then(response => {
                  axios({
                    method: 'delete',
                    url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId,
                    headers: { 'Authorization': auth.getAuthHeader() }
                  })
                })
              )
            } else {
              promises.push(
                // DELETE to API
                axios({
                  method: 'delete',
                  url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId,
                  headers: { 'Authorization': auth.getAuthHeader() }
                })
              )
            }
          }
        })
        // Await fullfillment of all promises
        axios.all(promises)
        .then(response => {
          console.log(response)
          this.buttonsActive = true
          location.reload()
        })
        .catch(error => {
          console.log(error)
          this.buttonsActive = true
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

  thead {
    white-space: nowrap;
  }

</style>
