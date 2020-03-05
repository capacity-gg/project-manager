const namespaced = true;

import axios from '@/utils/custom_axios.js';
import utils from '@/utils/utils.js';

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
    addMilestone(state, payload) {
        state.milestones.push(payload);
    },
    setMilestones(state, payload) {
        state.milestones = payload;
    }
}

const actions = {
    getMilestones(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        var milestones = [
            { ID: 1, title: 'Presentation' },
            { ID: 2, title: 'Feedback' },
            { ID: 3, title: 'Delivery' }
        ];
  
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
    }
}

export default {
    namespaced,
    state,
    mutations,
    actions,
    getters
};