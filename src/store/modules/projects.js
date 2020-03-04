const namespaced = true;

const state = {
    projectID: null,
    projects: []
}

const getters = {
    project(state, getters, rootState, rootGetters) {
        var activeProject = {};

        if (state.projects) {
        state.projects.forEach(function(project) {
            if (project.ID == state.projectID) {
            activeProject = project;
            return;
            }
        });
        }

        return activeProject;
    },
    projects(state, getters, rootState, rootGetters) {
        return state.projects;
    }
}

const mutations = {
    addProject(state, payload) {
        state.projects.push(payload.project);
    },
    setProjects(state, payload) {
        state.projects = payload;
    },
    setActiveProject(state, payload) {
        state.projectID = payload.ID;
    },
    updateProject(state, payload) {
        state.projects[payload.index] = payload.project;
    }        
}

const actions = {
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
                ID: 1,
                name: "Example Project 1",
                users: users,
                milestones: milestones,
                events: []
            }, {
                ID: 2,
                name: "Example Project 2",
                users: users,
                milestones: milestones,
                events: []
            }, {
                ID: 3,
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
    },
    getProject({commit}) {

    }
}

export default {
    namespaced,
    state,
    mutations,
    actions,
    getters
};