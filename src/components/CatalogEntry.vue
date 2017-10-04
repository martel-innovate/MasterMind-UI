<template>
<div class="section is-fullwidth">
  <section class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          {{service.name}}
        </h1>
        <h2 class="subtitle">
          {{service.service_protocol_type}}, NGSI Ver. {{service.ngsi_version}}
        </h2>
      </div>
    </div>
  </section>
  <br/>
  <ul>
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
    <br/>
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
    <br/>
    <li>
      <h2 class="notification is-info">Docker Compose:</h2>
      <div class="box is-fullwidth">
        <code style="white-space: pre-wrap">{{service.deploy_template}}</code>
      </div>
    </li>
  </ul>
  <router-link class="button" :to='"/catalog"'>Back</router-link>
</div>
</template>

<script type = "text/javascript" >
  import axios from 'axios'
  import auth from '../auth'
  export default {
    name: 'catalog-entry',
    created () {
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
