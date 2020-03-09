import Vue from 'vue'
import VueRouter from 'vue-router'
import utils from './utils/utils'

import { routes } from './routes';

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: '/project-manager/',//utils.getRouterBase(),
  routes: routes
})
