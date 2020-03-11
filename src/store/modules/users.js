const namespaced = true;

import axios from '@/utils/custom_axios.js';
import utils from '@/utils/utils.js';

const VueCookie = require('vue-cookie');
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
    setUsers(state, payload) {
        state.users = payload;
    },
    setActiveUser(state, payload) {
        state.userID = payload.ID;
    },
    addUser(state, payload) {
        if (utils.isNil(state.users)) { state.users = []; }

        state.users.push(payload);
    },
    removeUser(state, payload) {
        var users = state.users;

        if (utils.isNil(users)) { return; }

        for (var x = 0; x < users.length; x++) {
            if (users[x].ID == payload.ID) {
                users.splice(x, 1);
                break;
            }
        }
    },
    updateUser(state, payload) {
        var users = state.users;

        if (utils.isNil(users)) { return; }

        for (var x = 0; x < users.length; x++) {
            if (users[x].ID == payload.ID) {
                users.splice(x, 1, payload);
                break;
            }
        }
    }
}

const actions = {
    getUsers(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        var users = JSON.parse(VueCookie.get('users'));
  
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
    },
    updateUser(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        state.commit("updateUser", opts.user);

        var users = state.getters.users || [];

        VueCookie.set('users', JSON.stringify(users), {"expires": "10Y" });
  
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                opts.onSuccess(opts.user);
            }, 100);
        });
        
        /*axios.put(userBaseURL, opts.user)
        .then(response => { 
            opts.onSuccess(response.data); 
        })
        .catch(function(err) { 
            opts.onError(); 
        });*/
    },
    addUser(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        opts.user = utils.objPlus({
            "ID": utils.uuidv4()
        }, opts.user);

        state.commit("addUser", opts.user);

        var users = state.getters.users || [];

        VueCookie.set('users', JSON.stringify(users), {"expires": "10Y" });
  
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                opts.onSuccess(users);
            }, 100);
        });
        
        /*axios.post(userBaseURL, opts.user)
        .then(response => { 
            opts.onSuccess(response.data); 
        })
        .catch(function(err) { 
            opts.onError(); 
        });*/
    },
    removeUser(state, opts) {
        opts = utils.objPlus({
            "onSuccess": function() {},
            "onError": function() {}
        }, opts);

        state.commit("removeUser", opts.user);

        var users = state.getters.users || [];

        VueCookie.set('users', JSON.stringify(users), {"expires": "10Y" });
  
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                opts.onSuccess(users);
            }, 100);
        });
        
        /*axios.post(userBaseURL, opts.user)
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