<template>
  <div class="project">
    <div class="project-details">
      <h1>Project Details:</h1>
      <ul>
        <li>
          <b>{{project.name}}</b>:
        </li>
        <li>
          {{project.description}}
        </li>
      </ul>
    </div>
    <div class="cluster-list">
      <h1>Registered Clusters:</h1>
      <ul>
        <li v-for="cluster in clusters">
          {{cluster.name}}: {{cluster.description}}
        </li>
      </ul>
    </div>
    <div class="services-list">
      <h1>Registered Services:</h1>
      <ul>
        <li v-for="service in services">
          {{service.endpoint}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  export default {
    name: 'project',
    created () {
      axios.get('http://localhost:3000/v1/projects/' + this.$route.params.id, {headers: {'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY3Rvcl9pZCI6IjEiLCJleHAiOjE1MDQ3NzIyNjB9.6dOLY_lYjjzBzdvfAvfctD2ByiVz-y57CS0Fl-xbDCg'}})
      .then(response => { this.project = response.data })
      .catch(error => { console.log(error) })
      axios.get('http://localhost:3000/v1/projects/' + this.$route.params.id + '/clusters', {headers: {'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY3Rvcl9pZCI6IjEiLCJleHAiOjE1MDQ3NzIyNjB9.6dOLY_lYjjzBzdvfAvfctD2ByiVz-y57CS0Fl-xbDCg'}})
      .then(response => { this.clusters = response.data })
      .catch(error => { console.log(error) })
      axios.get('http://localhost:3000/v1/projects/' + this.$route.params.id + '/services', {headers: {'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY3Rvcl9pZCI6IjEiLCJleHAiOjE1MDQ3NzIyNjB9.6dOLY_lYjjzBzdvfAvfctD2ByiVz-y57CS0Fl-xbDCg'}})
      .then(response => { this.services = response.data })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        project: {},
        clusters: [],
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
