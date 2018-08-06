<template>
  <div class="box is-fullwidth">
    <div class="hero is-primary">
      <div class="hero-body has-text-centered">
        <h1 class="title is-2">
          Service Catalog
        </h1>
        <h2 class="subtitle is-4">
          A list of available services for MasterMind to deploy
        </h2>
      </div>
    </div>
    <!-- List the service types from the catalog -->
    <hr/>
    <a class="button is-large is-outlined is-fullwidth" v-on:click='updateCatalog()' v-show="!updating">
     <span>
       Update Catalog
     </span>
    </a>
    <a class="button is-large is-outlined is-fullwidth" v-show="updating" disabled>
     <span>
       Updating...
     </span>
    </a>
    <article v-if="updateError" class="message is-error">
      <div class="message-body">
        <h5>You are not allowed to update the Catalog, must be a MasterMind Superadmin</h5>
      </div>
    </article>
    <hr/>
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
  </div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  export default {
    // Get service types from API
    created () {
      axios.get(auth.getAPIUrl() + 'v1/service_types', {headers: {'Authorization': auth.getAuthHeader()}})
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
        catalog: [],
        updating: false,
        updateError: false
      }
    },
    methods: {
      // Updates the Catalog with the latest recipes from the main repo
      updateCatalog: function () {
        this.updating = true
        axios.get(auth.getAPIUrl() + 'v1/catalog/refresh', {headers: {'Authorization': auth.getAuthHeader()}})
        .then(response => { location.reload() })
        .catch(error => {
          console.log(error)
          this.updating = false
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
