// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VuejsDialog from 'vuejs-dialog'
import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/css/index.css'
require('../node_modules/bootstrap/less/bootstrap.less')

Vue.config.productionTip = false
Vue.use(VuejsDialog)
// Mouseover tooltips settings
Vue.use(Tooltip, {
  delay: 0,
  placement: 'top',
  class: 'tooltip-red',
  triggers: ['hover'],
  offset: 0
})

// Main Vue app
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
