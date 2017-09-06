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
  export default {
    name: 'project-list',
    created () {
      axios.get('http://localhost:3000/v1/projects', {headers: {'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY3Rvcl9pZCI6IjEiLCJleHAiOjE1MDQ3NzIyNjB9.6dOLY_lYjjzBzdvfAvfctD2ByiVz-y57CS0Fl-xbDCg'}})
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
