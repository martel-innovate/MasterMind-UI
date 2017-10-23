<template>
<div class="box is-fullwidth">
  <section class="hero is-primary">
    <div class="hero-body has-text-centered">
      <h1 class="title">
        Registered Subscriptions
      </h1>
      <h2 class="subtitle">
        The NGSI Subscriptions registered in this project
      </h2>
    </div>
  </section>
  <br/>
  <div>
    <ul>
      <li v-for="subscription in subscriptions">
        <router-link class="button is-primary is-large is-outlined is-fullwidth" :to='"/projects/"+$route.params.id+"/subscriptions/"+subscription.id'>{{subscription.name}}</router-link>
        <br/>
      </li>
    </ul>
  </div>
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
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/ngsi_subscriptions', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.subscriptions = response.data })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        subscriptions: []
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
