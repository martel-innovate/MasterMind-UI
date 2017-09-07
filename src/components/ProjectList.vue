<template>
  <div class="project-list">
    <div>
      <router-link to='/projects/new'>New Project</router-link>
    </div>
    <div>
      <ul>
        <li v-for="project in projects">
          <router-link :to='"/projects/"+project.id'>{{project.name}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  export default {
    name: 'project-list',
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.projects = response.data })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        projects: []
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
