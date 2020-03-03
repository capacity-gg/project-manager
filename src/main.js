import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store/store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

import { 
  faChevronLeft, 
  faChevronRight, 
  faCog, 
  faExclamation, 
  faFileDownload, 
  faFileUpload, 
  faUser, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faChevronLeft,
  faChevronRight,
  faCog,
  faExclamation,
  faFileDownload,
  faFileUpload,
  faUser,
  faTimes
)

// Global font components
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

// Global style sheets
require('@fullcalendar/core/main.css')
require('@fullcalendar/daygrid/main.css')
require('./assets/styles/main.scss')

axios.defaults.baseURL = 'http://localhost:8081'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
