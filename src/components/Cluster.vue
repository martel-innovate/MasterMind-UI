<template>
  <div class="cluster">
    <div class="cluster-details">
      <h1>Cluster Details:</h1>
      <ul>
        <li>
          <b>{{cluster.name}}</b>:
        </li>
        <li>
          Description: {{cluster.description}}
        </li>
        <li>
          Endpoint: {{cluster.endpoint}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  export default {
    name: 'project',
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.project_id + '/clusters/' + this.$route.params.cluster_id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.cluster = response.data })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        cluster: {}
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
