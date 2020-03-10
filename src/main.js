import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

import { 
  faBars,
  faChevronLeft, 
  faChevronRight, 
  faCog, 
  faEdit,
  faExclamation, 
  faFileDownload, 
  faFileUpload, 
  faPlusSquare,
  faUser, 
  faTimes, 
  faTrash 
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faBars,
  faChevronLeft,
  faChevronRight,
  faCog,
  faEdit,
  faExclamation,
  faFileDownload,
  faFileUpload,
  faPlusSquare,
  faUser,
  faTimes, 
  faTrash
)

// Global font components
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

// Global style sheets
require('@fullcalendar/core/main.css')
require('@fullcalendar/daygrid/main.css')
require('../static/styles/main.scss')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
