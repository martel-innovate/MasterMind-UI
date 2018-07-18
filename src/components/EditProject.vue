<template>
  <div class="box">
    <section class="hero is-primary">
      <div class="hero-body">
        <h1 class="title is-2">
          Edit Project
        </h1>
      </div>
    </section>
    <hr/>
    <div id="project">
      <p class="title">
        Name
      </p>
      <p class="control">
        <input class="input" name="name" type="text" v-model="name" placeholder="Name" v-validate.initial="'required|alpha_dash'">
        <p class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</p>
      </p>
      <hr/>
      <p class="title">
        Description
      </p>
      <p class="control">
        <input class="input" name="description" type="text" v-model="description" placeholder="Description" v-validate.initial="'required'">
        <p class="text-danger" v-if="errors.has('description')">{{ errors.first('description') }}</p>
      </p>
      <hr/>
      <router-link class="button is-medium" :to='"/projects/"+this.$route.params.id'>Back</router-link>
      <button class="button is-medium is-primary" v-on:click="submit" :disabled="errors.any()">Edit Project</button>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import router from '../router'
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'

  Vue.use(VeeValidate)

  export default {
    data () {
      return {
        name: '',
        description: ''
      }
    },
    created () {
      // Get project details
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        this.name = response.data.name
        this.description = response.data.description
      })
      .catch(error => { console.log(error) })
    },
    methods: {
      // Submit project edit
      submit: function (event) {
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
        // Send PUT to the API
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
