<template>
  <div class="box is-fullwidth">
    <section class="hero is-primary">
      <div class="hero-body has-text-centered">
        <h1 class="title">
          Service Catalog
        </h1>
        <h2 class="subtitle">
          A list of available services for MasterMind to deploy
        </h2>
      </div>
    </section>
    <br/>
    <p v-for="service in catalog">
      <router-link class="button is-primary is-large is-outlined is-fullwidth" :to='"/catalog/"+service.id'>{{service.name}}</router-link>
    </p>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  export default {
    created () {
      axios.get(auth.getAPIUrl() + 'v1/service_types', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.catalog = response.data })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        catalog: []
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
