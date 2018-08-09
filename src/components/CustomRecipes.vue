<template>
  <div class="box is-fullwidth">
    <div class="hero is-primary">
      <div class="hero-body has-text-centered">
        <h1 class="title is-2">
          Custom Recipes
        </h1>
        <h2 class="subtitle is-4">
          A list of custom recipes imported for this Project
        </h2>
      </div>
    </div>
    <br/>
    <div>
      <router-link :to='"/"'>Projects</router-link>
      /
      <router-link :to='"/projects/"+$route.params.id'>{{project.name}}</router-link>
      /
      Recipes
    </div>
    <!-- List the service types -->
    <hr/>
    <div class="columns">
      <div class="column is-fullwidth">
        <a v-on:click="isActive = !isActive" class="button is-large has-text-centered is-info is-outlined is-fullwidth">
         <span>
           Import Recipes
         </span>
        </a>
      </div>
    </div>
    <hr/>
    <div v-if="catalog.length == 0" class="box">
      <p>
        No Custom Recipes imported
      </p>
    </div>
    <div class="columns is-multiline is-mobile">
      <div class="column card is-one-quarter" v-for="service in catalog">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
              </figure>
            </div>
            <div class="media-content">
              <span class="button is-medium is-danger is-pulled-right" v-tooltip="'Delete Recipe'" v-on:click='deleteRecipe(service.id)'>
                <i class="fa fa-trash"></i>
              </span>
              <p><router-link class="title is-4" :to='"/catalog/"+service.id'>{{service.name}}</router-link></p>
              <p class="subtitle is-5">{{service.version}}</p>
            </div>
          </div>
          <div class="content">
            {{service.description}}
          </div>
        </div>
      </div>
    </div>

    <!-- Popup box with catalog import form -->
    <div id="importCatalog" v-bind:class="{ 'modal' : true, 'is-active' : isActive }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <h1 class="modal-card-title">Import Custom Catalog</h1>
          <button class="delete" aria-label="close" v-on:click="isActive = !isActive"></button>
        </header>
        <section class="modal-card-body">
           <div>
             <label class="title">
               Catalog Repository URI
             </label>
              <div class="control">
                <input class="input" name="catalogURI" type="text" placeholder="Catalog URI" v-model="catalogURI" v-validate.initial="'required|url'">
                <p class="text-danger" v-if="errors.has('catalogURI')">{{ errors.first('catalogURI') }}</p>
              </div>
            <hr/>
            <label class="title">
              Catalog Repository Branch
            </label>
            <div class="control has-icon has-icon-right">
              <textarea class="input is-success" name="catalogBranch" type="textarea" placeholder="master" v-model="catalogBranch" v-validate.initial="'alpha_dash'"></textarea>
              <p class="text-danger" v-if="errors.has('catalogBranch')">{{ errors.first('catalogBranch') }}</p>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button v-on:click="submit" class="button is-success is-medium" :disabled="errors.any()">Import</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  export default {
    // Get service types from API
    created () {
      axios.get(auth.getAPIUrl() + 'v1/projects/' + this.$route.params.id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => { this.project = response.data })
      .catch(error => { console.log(error) })
      axios.get(auth.getAPIUrl() + 'v1/service_types?project_id=' + this.$route.params.id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        var catalog = response.data
        catalog.sort(function (a, b) {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })
        this.catalog = response.data
      })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        project: {},
        catalog: [],
        catalogURI: '',
        catalogBranch: 'master',
        isActive: false
      }
    },
    methods: {
      // Import Catalog
      submit: function (event) {
        this.isActive = false
        var projectId = this.$route.params.id
        if (this.errors.any()) {
          console.log('Form not valid')
          return
        }
        // POST to API
        axios({
          method: 'post',
          url: auth.getAPIUrl() + 'v1/catalog/importcustom',
          headers: { 'Authorization': auth.getAuthHeader() },
          data: {
            project_id: projectId,
            custom_catalog_uri: this.catalogURI,
            custom_catalog_branch: this.catalogBranch
          }
        })
        .then(function (response) {
          console.log(response.data)
          location.reload()
        })
        .catch(function (error) {
          console.log(error)
          alert('COULD NOT LOAD CATALOG: ' + error.response.data.message)
        })
      },
      // Delete selected custom recipe
      deleteRecipe: function (serviceTypeId) {
        // Setting this outside of axios function
        this.$dialog.confirm('Are you sure you want to delete this recipe?', {okText: 'DELETE', cancelText: 'CANCEL'})
        .then(function () {
          // Sending delete to API
          axios({
            method: 'delete',
            url: auth.getAPIUrl() + 'v1/service_types/' + serviceTypeId,
            headers: { 'Authorization': auth.getAuthHeader() }
          })
          .then(function (response) {
            console.log(response.data)
            location.reload()
          })
          .catch(function (error) {
            console.log(error)
            alert(error)
          })
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
