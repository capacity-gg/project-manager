import Home from './components/home.vue'
import NotFound from './components/notFound.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  }, {
    path: '/project:ID',
    name: 'project',
    component: () => import('./components/editor.vue')
  }, {
    path: '/users',
    name: 'users',
    component: () => import('./components/users.vue')
  }, {
    path: '/milestones',
    name: 'milestones',
    component: () => import('./components/milestones.vue')
  }, { 
    path: '*', 
    name: 'error404',
    component: NotFound 
  }
];
