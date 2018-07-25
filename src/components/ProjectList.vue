<template>
  <div>
    <div class="box">
      <section class="hero is-primary">
        <div class="hero-body has-text-centered">
          <h1 class="title is-2">
            Projects
          </h1>
          <h2 class="subtitle is-4">
            List of all projects available
          </h2>
        </div>
      </section>
      <hr/>
      <!-- List all projects the user can access -->
      <div v-if="!noProjects()" class="card" v-for="project in projects">
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <h2><router-link class="is-primary" :to='"/projects/"+project.id'>{{project.name}}</router-link></h2>
            </div>
          </div>
          <div class="content">
            {{project.description}}
          </div>
        </div>
      </div>
      <!-- If no projects available to the user, show button to create the first one -->
      <p v-if="noProjects()" class="field">
        <a v-on:click="isActive = !isActive" class="button is-large is-outlined is-fullwidth">
         <span>
           Create your first Project
         </span>
        </a>
      </p>
      <hr/>
      <!-- If projects already exist, show button for just new project -->
      <p v-if="!noProjects()" class="field">
        <a v-on:click="isActive = !isActive" class="button is-medium">
         <span>
           New Project
         </span>
        </a>
      </p>
    </div>
    <div>
      <!-- Popup box with new project creation form -->
      <div id="newProj" v-bind:class="{ 'modal' : true, 'is-active' : isActive }">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <h1 class="modal-card-title">New Project</h1>
            <button class="delete" aria-label="close" v-on:click="isActive = !isActive"></button>
          </header>
          <section class="modal-card-body">
             <div>
               <label class="title">
                 Project name
               </label>
              <div class="control">
                <input class="input" name="name" type="text" placeholder="Project name" v-model="name" v-validate.initial="'required|alpha_dash'">
                <p class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</p>
              </div>
              <hr/>
              <label class="title">
                Project description
              </label>
              <div class="control has-icon has-icon-right">
                <textarea class="input is-success" name="description" type="textarea" placeholder="Description" v-model="description" v-validate.initial="'required'"></textarea>
                <p class="text-danger" v-if="errors.has('description')">{{ errors.first('description') }}</p>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button v-on:click="submit" class="button is-success is-medium" :disabled="errors.any()">Create Project</button>
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
    // Get list of projects
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
      // Submit new project to API
      submit: function (event) {
        this.isActive = false
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
        // POST to API
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
      },
      // Check if there are projects the user can access
      noProjects: function () {
        return (this.projects.length === 0)
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
