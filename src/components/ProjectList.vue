<template>
  <div>
    <div class="box">
      <section class="hero is-primary">
        <div class="hero-body has-text-centered">
          <h1 class="title">
            Projects
          </h1>
          <h2 class="subtitle">
            List of all projects available
          </h2>
        </div>
      </section>
      <br/>
      <table class="table">
        <tbody v-for="project in projects">
          <tr>
            <td>
              <router-link class="button is-primary is-large is-outlined is-fullwidth" :to='"/projects/"+project.id'>{{project.name}}</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <hr/>
      <p class="field">
        <a v-on:click="isActive = !isActive" class="button">
         <span>
           New Project
         </span>
        </a>
      </p>
    </div>
    <div>
      <div id="newProj" v-bind:class="{ 'modal' : true, 'is-active' : isActive }">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">New Project</p>
            <button class="delete" aria-label="close"></button>
          </header>
          <section class="modal-card-body">
             <div class="panel-block">
               <p class="title">
                 Project name
               </p>
              <p class="control">
                <input class="input" name="name" type="text" placeholder="Project name" v-model="name" v-validate.initial="'required|alpha_dash'">
                <p class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</p>
              </p>
              <hr/>
              <p class="title">
                Project description
              </p>
              <p class="control has-icon has-icon-right">
                <input class="input is-success" name="description" type="text" placeholder="Description" v-model="description" v-validate.initial="'required'">
                <p class="text-danger" v-if="errors.has('description')">{{ errors.first('description') }}</p>
              </p>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button v-on:click="submit" class="button is-success" :disabled="errors.any()">Create Project</button>
            <button v-on:click="isActive = !isActive" class="button">Cancel</button>
          </footer>
        </div>
      </div>
    </div>

  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'
  import router from '../router'

  Vue.use(VeeValidate)

  export default {
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects', {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.projects = response.data })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        projects: [],
        name: '',
        description: '',
        isActive: false
      }
    },
    methods: {
      submit: function (event) {
        this.isActive = false
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
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
          router.push('/projects/' + response.data.id)
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
