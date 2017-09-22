<template>
    <div>
      <p class="field">
         <a v-on:click="isActive = !isActive" class="button is-large">
             <span class="icon is-medium">
               <i class="fa fa-plus"></i>
             </span>
             <span>New Project</span>
           </a>
       </p> 
    <div id="newProj" v-bind:class="{ 'modal' : true, 'is-active' : isActive }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">New Project</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
           <div class="panel-block">
            <label class="label">Project name</label>
            <p class="control">
              <input class="input" type="text" placeholder="Project name" v-model="name">
            </p>
            <label class="label">Project description</label>
            <p class="control has-icon has-icon-right">
              <input class="input is-success" type="text" placeholder="Description" v-model="description">
            </p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button v-on:click="submit" class="button is-success">Save changes</button>
          <button v-on:click="isActive = !isActive" class="button">Cancel</button>
        </footer>
      </div>
    </div>  
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
        description: '',
        isActive: false
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
