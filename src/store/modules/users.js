const namespaced = true;

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
    getUsers({commit}) {
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
                commit('setUsers', users);
                resolve();
            }, 100);
        })
    }
}

export default {
    namespaced,
    state,
    mutations,
    actions,
    getters
};