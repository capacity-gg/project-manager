const namespaced = true;

import axios from '@/utils/custom_axios.js';
import utils from '@/utils/utils.js';

const projectBaseURL = process.env.switchboardBaseURL + "projects/";

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
        state.projects.push(payload);
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
    getProjects(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

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
                opts.onSuccess(projects);
            }, 100);
        });
        
        /*axios.get(projectBaseURL)
        .then(response => { 
            opts.onSuccess(response.data); 
        })
        .catch(function(err) { 
            opts.onError(); 
        });*/
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