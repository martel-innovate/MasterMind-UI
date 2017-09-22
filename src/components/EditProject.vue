<template>
  <div class="panel-block">
    <p class="panel-heading">Edit Project</p>
    <div id="project">
      <p class="control">
        <input class="input" type="text" v-model="name" placeholder="Name">
      </p>
      <p class="control">
        <input class="input" type="text" v-model="description" placeholder="Description">
      </p>
      <button class="button is-primary" v-on:click="submit">Edit Project</button>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'

  export default {
    name: 'edit-project',
    data () {
      return {
        name: '',
        description: ''
      }
    },
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.name = response.data.name
        this.description = response.data.description
      })
      .catch(error => { console.log(error) })
    },
    methods: {
      submit: function (event) {
        axios({
          method: 'put',
          url: auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id,
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
