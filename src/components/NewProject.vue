<template>
  <div class="new-project">
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
  export default {
    name: 'new-project',
    data () {
      return {
        name: '<project name>',
        description: '<project description>'
      }
    },
    methods: {
      submit: function (event) {
        axios({
          method: 'post',
          url: 'http://localhost:3000/v1/projects',
          headers: {'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY3Rvcl9pZCI6IjEiLCJleHAiOjE1MDQ3NzIyNjB9.6dOLY_lYjjzBzdvfAvfctD2ByiVz-y57CS0Fl-xbDCg'},
          data: {
            name: this.name,
            description: this.description
          }
        })
        .then(function (response) {
          console.log(response.data)
          window.location.replace('/projects')
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
