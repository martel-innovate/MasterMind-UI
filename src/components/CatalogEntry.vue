<template>
<div class="box is-fullwidth">
  <section class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <h1 class="title is-2">
          {{service.name}}:{{service.version}}
        </h1>
        <h2 class="subtitle is-4">
          {{service.service_protocol_type}}, NGSI Ver. {{service.ngsi_version}}
        </h2>
      </div>
    </div>
  </section>
  <hr/>
  <ul>
    <!-- Display Env Variables that are configurable -->
    <!-- TODO: Maybe improve the way they are displayed -->
    <li v-show="env_variables">
      <h2 class="notification is-info">Configuration Variables:</h2>
      <div class="box is-fullwidth">
        <p v-for="envVar in env_variables">
          {{ envVar.name }}:
          <ul>
            <li>Variable: {{ envVar.variable }}</li>
            <li>Description: {{ envVar.description }}</li>
            <li>Required: {{ envVar.required }}</li>
            <li>Default Value: {{ envVar.default }}</li>
          </ul>
        </p>
      </div>
    </li>
    <!-- Display the services that can be linked -->
    <!-- TODO: Maybe improve the way they are displayed -->
    <li v-show="linked_services">
      <h2 class="notification is-info">Service Links:</h2>
      <div class="box is-fullwidth">
        <p v-for="service in linked_services">
          {{ service.service_type }}:
          <ul>
            <li>Retrieves: {{ service.retrieve }}</li>
            <li>As: {{ service.as }}</li>
          </ul>
        </p>
      </div>
    </li>
    <!-- Display the docker compose that deploys this service type -->
    <li>
      <h2 class="notification is-info">Docker Compose:</h2>
      <div class="box is-fullwidth">
        <code style="white-space: pre-wrap">{{service.deploy_template}}</code>
      </div>
    </li>
  </ul>
  <hr/>
  <router-link class="button" :to='"/catalog"'>Back</router-link>
</div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  export default {
    created () {
      // Retrieve all the service types
      axios.get(auth.getAPIUrl() + 'v1/service_types/' + this.$route.params.id, {headers: {'Authorization': auth.getAuthHeader()}})
      .then(response => {
        const yaml = require('js-yaml')
        const config = yaml.safeLoad(response.data.configuration_template)
        this.service = response.data
        this.description = config.description
        this.version = config.version
        this.env_variables = config.environment_variables
        this.linked_services = config.services
      })
      .catch(error => { console.log(error) })
    },
    data () {
      return {
        service: {},
        description: '',
        version: '',
        env_variables: [],
        linked_services: []
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
