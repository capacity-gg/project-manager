const namespaced = true;

import axios from '@/utils/custom_axios.js';
import utils from '@/utils/utils.js';

const userBaseURL = process.env.switchboardBaseURL + "users/";

const state = {
    users: []
}

const getters = {
    users(state, getters, rootState, rootGetters) {
        return state.users;
    }
}

const mutations = {
    addUser(state, payload) {
        state.users.push(payload);
    },
    setUsers(state, payload) {
        state.users = payload;
    }
}

const actions = {
    getUsers(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        var users = [
            { ID: 1, title: 'Melissa' },
            { ID: 2, title: 'Dan' },
            { ID: 3, title: 'Jamie' },
            { ID: 4, title: 'Daryl' },
            { ID: 5, title: 'Benji' },
            { ID: 6, title: 'Ellerey' }
        ];
  
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                opts.onSuccess(users);
            }, 100);
        });
        
        /*axios.get(userBaseURL)
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