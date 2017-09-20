<template>
  <div class="project-list">
    <table class="table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th></th>
                    <th></th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody v-for="project in projects">
                  <tr>
                    <td>
                        <span class="button is-primary">{{project.name}}</span>                      
                    </td>
                    <td></td>
                    <td></td>
                    <td class="is-icon">
                      <router-link :to='"/projects/"+project.id'>
                        <span class="icon">
                                           <i class="fa fa-eye"></i>
                                         </span>
                      </router-link>
                    </td>
                  </tr>
                  
                </tbody>
              </table>
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
