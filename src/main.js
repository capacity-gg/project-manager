import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store/store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronLeft, faChevronRight, faCog, faExclamation, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

library.add(
  faChevronLeft,
  faChevronRight,
  faCog,
  faExclamation,
  faUser
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require('@fullcalendar/core/main.css')
require('@fullcalendar/daygrid/main.css')
require('./assets/style.scss')

axios.defaults.baseURL = 'http://localhost:8081'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
