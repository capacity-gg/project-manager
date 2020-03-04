import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/pages/project_selector.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'project_selector',
    component: Home
  }, {
    path: '/project:ID',
    name: 'project',
    component: () => import('./components/pages/project_editor.vue')
  }]
})
