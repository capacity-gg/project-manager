import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/pages/project_selector.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'project_selector',
    component: Home
  }, {
    path: '/project:ID',
    name: 'project',
    component: () => import('./components/pages/project_editor.vue')
  }, {
    path: '/users',
    name: 'project_users',
    component: () => import('./components/pages/project_users.vue')
  }, {
    path: '/milestones',
    name: 'project_milestones',
    component: () => import('./components/pages/project_milestones.vue')
  }]
})
