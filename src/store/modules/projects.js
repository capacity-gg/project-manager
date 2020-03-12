const namespaced = true;

import axios from '@/utils/custom_axios.js';
import utils from '@/utils/utils.js';

const VueCookie = require('vue-cookie');
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
    setProjects(state, payload) {
        state.projects = payload;
    },
    setActiveProject(state, payload) {
        state.projectID = payload.ID;
    },
    addProject(state, payload) {
        if (utils.isNil(state.projects)) { state.projects = []; }

        state.projects.push(payload);
    },
    removeProject(state, payload) {
        var projects = state.projects;

        if (utils.isNil(projects)) { return; }

        for (var x = 0; x < projects.length; x++) {
            if (projects[x].ID == payload.ID) {
                projects.splice(x, 1);
                break;
            }
        }
    },
    updateProject(state, payload) {
        var projects = state.projects;

        if (utils.isNil(projects)) { return; }

        for (var x = 0; x < projects.length; x++) {
            if (projects[x].ID == payload.ID) {
                projects.splice(x, 1, payload);
                break;
            }
        }
    }
}

const actions = {
    getProjects(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        var projects = JSON.parse(VueCookie.get('projects'));
  
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
    updateProject(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        state.commit("updateProject", opts.project);

        var projects = state.getters.projects || [];

        VueCookie.set('projects', JSON.stringify(projects), {"expires": "10Y" });
  
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                opts.onSuccess(opts.project);
            }, 100);
        });
        
        /*axios.put(projectBaseURL, opts.project)
        .then(response => { 
            opts.onSuccess(response.data); 
        })
        .catch(function(err) { 
            opts.onError(); 
        });*/
    },
    addProject(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        opts.project = utils.objPlus({
            "ID": utils.uuidv4(),
            "events": [],
            "milestones": [],
            "users": []
        }, opts.project);

        state.commit("addProject", opts.project);

        var projects = state.getters.projects || [];

        VueCookie.set('projects', JSON.stringify(projects), {"expires": "10Y" });
  
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                opts.onSuccess(projects);
            }, 100);
        });
        
        /*axios.post(projectBaseURL, opts.project)
        .then(response => { 
            opts.onSuccess(response.data); 
        })
        .catch(function(err) { 
            opts.onError(); 
        });*/
    },
    removeProject(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        state.commit("removeProject", opts.project);

        var projects = state.getters.projects || [];

        VueCookie.set('projects', JSON.stringify(projects), {"expires": "10Y" });
  
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                opts.onSuccess(projects);
            }, 100);
        });
        
        /*axios.post(projectBaseURL, opts.project)
        .then(response => { 
            opts.onSuccess(response.data); 
        })
        .catch(function(err) { 
            opts.onError(); 
        });*/
    }
}

export default {
    namespaced,
    state,
    mutations,
    actions,
    getters
};