<template>
  <div class="service-catalog">
    <div>
      <ul>
        <li v-for="service in catalog">
          <router-link :to='"/catalog/"+service.id'>{{service.name}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  export default {
    name: 'service-catalog',
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
