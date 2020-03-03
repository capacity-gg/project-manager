import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projects: []
  },
  getters: {
    project(state, getters, rootState, rootGetters) {
      return state.projects.length > 0 ? state.projects[0] : {};
    },
    projects(state, getters, rootState, rootGetters) {
      return state.projects;
    }
  },
  mutations: {
    addProject(state, payload) {
      state.projects.push(payload.project);
    },
    setProjects(state, payload) {
      state.projects = payload;
    },
    updateProject(state, payload) {
      state.projects[payload.index] = payload.project;
    }
  },
  actions: {
    getProjects({commit}) {
      var users = [
        { title: 'Melissa', count: '0' },
        { title: 'Dan', count: '0' },
        { title: 'Jamie', count: '0' },
        { title: 'Daryl', count: '0' },
        { title: 'Benji', count: '0' },
        { title: 'Ellerey', count: '0' }
      ];

      var milestones = [
        { title: 'Presentation' },
        { title: 'Feedback' },
        { title: 'Delivery' }
      ];

      var projects = [
        {
          id: 1,
          name: "Example Project 1",
          users: users,
          milestones: milestones,
          events: []
        }, {
          id: 2,
          name: "Example Project 2",
          users: users,
          milestones: milestones,
          events: []
        }, {
          id: 3,
          name: "Example Project 3",
          users: users,
          milestones: milestones,
          events: []
        }
      ];

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('setProjects', projects);
          resolve();
        }, 100);
      })
    }
  },
  modules: {}
})
