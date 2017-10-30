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
  <input v-model="searchQuery" placeholder="Search...">
  <hr/>
  <table class="table">
    <thead>
      <tr class="subtitle">
        <td>Name</td>
        <td>Endpoint</td>
        <td>Service</td>
        <td>Entities</td>
        <td>Attributes</td>
        <td>Status</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="subscription in filterSubscriptions(subscriptions, searchQuery)">
        <td>
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
            {{entity.id}}, {{entity.type}}
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
      </tr>
    </tbody>
  </table>
  <hr/>
  <button v-if="!buttonsActive" class="button is-loading" disabled></button>
  <button v-if="!buttonsActive" class="button is-loading" disabled></button>
  <button v-if="!buttonsActive" class="button is-danger is-loading" disabled></button>
  <button v-if="buttonsActive" class="button" v-on:click="activateSubscription"><b>Activate</b></button>
  <button v-if="buttonsActive" class="button" v-on:click="deactivateSubscription"><b>Deactivate</b></button>
  <button v-if="buttonsActive" class="button is-danger" v-on:click="deleteSubscription"><b>Delete Selected</b></button>
  <hr/>
  <router-link class="button" :to='"/projects/"+$route.params.id'>Back</router-link>
  <router-link class="button" :to='"/projects/"+$route.params.id+"/subscriptions/new"'>Register Subscription</router-link>
</div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  export default {
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.project = response.data })
      .catch(error => { console.log(error) })
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/services', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.services = response.data
        console.log(this.services)
      })
      .catch(error => { console.log(error) })
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/ngsi_subscriptions', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.subscriptions = response.data
        this.subscriptions.sort(function (a, b) {
          return a.service_id - b.service_id
        })
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
        buttonsActive: true
      }
    },
    methods: {
      getServiceName: function (subscriptionId) {
        return this.services.find(function (service) {
          return service.id === subscriptionId
        })
      },
      filterSubscriptions: function (subscriptions, searchQuery) {
        return subscriptions.filter(function (subscription) {
          return subscription.name.includes(searchQuery)
        })
      },
      activateSubscription: function (event) {
        this.buttonsActive = false
        var projectId = this.$route.params.id
        var promises = []

        this.subscriptions.forEach(function (subscription) {
          var subscriptionId = subscription.id
          if (subscription.checked && subscription.status === 'inactive') {
            promises.push(
              axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/activate', {headers: {'Authorization': auth.getAuthHeader()}})
            )
          } else if (subscription.checked && subscription.status === 'unregistered') {
            promises.push(
              axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/register', {headers: {'Authorization': auth.getAuthHeader()}})
            )
          }
        })

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
      deactivateSubscription: function (event) {
        this.buttonsActive = false
        var projectId = this.$route.params.id
        var promises = []

        this.subscriptions.forEach(function (subscription) {
          if (subscription.checked && subscription.status === 'active') {
            var subscriptionId = subscription.id
            promises.push(
              axios.get(auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId + '/deactivate', {headers: {'Authorization': auth.getAuthHeader()}})
            )
          }
        })

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
      deleteSubscription: function () {
        this.buttonsActive = false
        var projectId = this.$route.params.id
        var promises = []

        this.subscriptions.forEach(function (subscription) {
          if (subscription.checked) {
            var subscriptionId = subscription.id
            var subId = subscription.subscription_id

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
                axios({
                  method: 'delete',
                  url: auth.getAPIUrl() + 'v1/projects/' + projectId + '/ngsi_subscriptions/' + subscriptionId,
                  headers: { 'Authorization': auth.getAuthHeader() }
                })
              )
            }
          }
        })

        axios.all(promises)
        .then(response => {
          console.log(response)
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
