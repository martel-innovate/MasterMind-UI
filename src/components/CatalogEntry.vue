<template>
  <div class="catalog-entry">
    <div class="catalog-entry-details">
      <h1>Service Details:</h1>
      <ul>
        <li>
          <h2>{{service.name}}</h2>
        </li>
        <li>
          Protocol Type: {{service.service_protocol_type}}
        </li>
        <li>
          NGSI Version: {{service.ngsi_version}}
        </li>
        <li v-show="env_variables">
          <hr/>
          Configuration Variables:
          <p v-for="envVar in env_variables">
            {{ envVar.name }}:
            <ul>
              <li>Variable: {{ envVar.variable }}</li>
              <li>Description: {{ envVar.description }}</li>
              <li>Required: {{ envVar.required }}</li>
              <li>Default Value: {{ envVar.default }}</li>
            </ul>
          </p>
        </li>
        <li v-show="linked_services">
          <hr/>
          Service Links:
          <p v-for="service in linked_services">
            {{ service.service_type }}:
            <ul>
              <li>Retrieves: {{ service.retrieve }}</li>
              <li>As: {{ service.as }}</li>
            </ul>
          </p>
        </li>
        <hr/>
        <li>
          Docker Compose:
          <br/>
          <code>{{service.deploy_template}}</code>
        </li>
      </ul>
    </div>
    <hr/>
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
