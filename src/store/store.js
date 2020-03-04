import Vue from 'vue'
import Vuex from 'vuex'

import milestones from './modules/milestones';
import projects from './modules/projects';
import users from './modules/users';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    milestones,
    projects,
    users
  }
})
