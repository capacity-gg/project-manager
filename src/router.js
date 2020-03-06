import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/home.vue'

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
    component: () => import('./components/editor.vue')
  }, {
    path: '/users',
    name: 'project_users',
    component: () => import('./components/users.vue')
  }, {
    path: '/milestones',
    name: 'project_milestones',
    component: () => import('./components/milestones.vue')
  }]
})
