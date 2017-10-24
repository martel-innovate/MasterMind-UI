<template>
<div class="box is-fullwidth">
  <section class="hero is-primary">
    <div class="hero-body has-text-centered">
      <h1 class="title">
        Registered Services
      </h1>
      <h2 class="subtitle">
        The IoT services registered in this Project
      </h2>
    </div>
  </section>
  <br/>
  <div>
    <ul>
      <li v-for="service in services">
        <router-link class="button is-primary is-large is-outlined is-fullwidth" :to='"/projects/"+$route.params.id+"/services/"+service.id'>{{service.name}}</router-link>
        <br/>
      </li>
    </ul>
  </div>
  <hr/>
  <router-link class="button" :to='"/projects/"+$route.params.id'>Back</router-link>
  <router-link class="button" :to='"/projects/"+$route.params.id+"/services/new"'>Register Service</router-link>
</div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  export default {
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id + '/services', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.services = response.data })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        services: []
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
