import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import utils from './utils/utils';

// Third-party plugins
import VueRouter from 'vue-router';
import VueCookie from 'vue-cookie';

// Fonts
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

try {  
  Vue.use(VueRouter);  
  Vue.use(VueCookie);
  Vue.prototype.utils = utils; 

  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
}
catch(err) {
  console.log(err);
}
