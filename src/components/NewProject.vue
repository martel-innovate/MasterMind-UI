<template>
  <div class="new-project">
    <h1>New Project</h1>
    <form id="project">
      <p>
        Project Name: <input type="text" v-model="name">
      </p>
      <p>
        Project Description: <input type="text" v-model="description">
      </p>
      <button v-on:click="submit">Create Project</button>
    </form>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'

  export default {
    name: 'new-project',
    data () {
      return {
        name: '',
        description: ''
      }
    },
    methods: {
      submit: function (event) {
        axios({
          method: 'post',
          url: auth.getAPIUrl() + 'v1/projects',
          headers: { 'Authorization': auth.getAuthHeader() },
          data: {
            name: this.name,
            description: this.description
          }
        })
        .then(function (response) {
          console.log(response.data)
          router.push('/projects')
        })
        .catch(function (error) {
          console.log(error)
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
</style>
