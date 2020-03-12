const namespaced = true;

import axios from '@/utils/custom_axios.js';
import utils from '@/utils/utils.js';

const VueCookie = require('vue-cookie');
const milestoneBaseURL = process.env.switchboardBaseURL + "milestones/";

const state = {
    milestones: []
}

const getters = {
    milestones(state, getters, rootState, rootGetters) {
        return state.milestones;
    }
}

const mutations = {
    setMilestones(state, payload) {
        state.milestones = payload;
    },
    setActiveMilestone(state, payload) {
        state.milestoneID = payload.ID;
    },
    addMilestone(state, payload) {
        if (utils.isNil(state.milestones)) { state.milestones = []; }

        state.milestones.push(payload);
    },
    removeMilestone(state, payload) {
        var milestones = state.milestones;

        if (utils.isNil(milestones)) { return; }

        for (var x = 0; x < milestones.length; x++) {
            if (milestones[x].ID == payload.ID) {
                milestones.splice(x, 1);
                break;
            }
        }
    },
    updateMilestone(state, payload) {
        var milestones = state.milestones;

        if (utils.isNil(milestones)) { return; }

        for (var x = 0; x < milestones.length; x++) {
            if (milestones[x].ID == payload.ID) {
                milestones.splice(x, 1, payload);
                break;
            }
        }
    }
}

const actions = {
    getMilestones(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        var milestones = JSON.parse(VueCookie.get('milestones'));
  
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                opts.onSuccess(milestones);
            }, 100);
        });
        
        /*axios.get(milestoneBaseURL)
        .then(response => { 
            opts.onSuccess(response.data); 
        })
        .catch(function(err) { 
            opts.onError(); 
        });*/
    },
    setMilestones(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        var milestones = state.getters.milestones || [];

        milestones = milestones.concat(opts.milestones);

        VueCookie.set('milestones', JSON.stringify(milestones), {"expires": "10Y" });

        state.commit("setMilestones", opts.milestones);
  
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                opts.onSuccess(opts.milestones);
            }, 100);
        });
        
        /*axios.put(milestoneBaseURL, opts.milestones)
        .then(response => { 
            opts.onSuccess(response.data); 
        })
        .catch(function(err) { 
            opts.onError(); 
        });*/
    },
    updateMilestone(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        state.commit("updateMilestone", opts.milestone);

        var milestones = state.getters.milestones || [];

        VueCookie.set('milestones', JSON.stringify(milestones), {"expires": "10Y" });
  
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                opts.onSuccess(opts.milestone);
            }, 100);
        });
        
        /*axios.put(milestoneBaseURL, opts.milestone)
        .then(response => { 
            opts.onSuccess(response.data); 
        })
        .catch(function(err) { 
            opts.onError(); 
        });*/
    },
    addMilestone(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        opts.milestone = utils.objPlus({
            "ID": utils.uuidv4()
        }, opts.milestone);

        state.commit("addMilestone", opts.milestone);

        var milestones = state.getters.milestones || [];

        VueCookie.set('milestones', JSON.stringify(milestones), {"expires": "10Y" });
  
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                opts.onSuccess(milestones);
            }, 100);
        });
        
        /*axios.post(milestoneBaseURL, opts.milestone)
        .then(response => { 
            opts.onSuccess(response.data); 
        })
        .catch(function(err) { 
            opts.onError(); 
        });*/
    },
    removeMilestone(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        state.commit("removeMilestone", opts.milestone);

        var milestones = state.getters.milestones || [];

        VueCookie.set('milestones', JSON.stringify(milestones), {"expires": "10Y" });
  
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                opts.onSuccess(milestones);
            }, 100);
        });
        
        /*axios.post(milestoneBaseURL, opts.milestone)
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