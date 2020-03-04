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
    setUsers(state, payload) {
        state.users = payload;
    }
}

const actions = {
    getUsers({commit}) {
        var users = [
            { title: 'Melissa' },
            { title: 'Dan' },
            { title: 'Jamie' },
            { title: 'Daryl' },
            { title: 'Benji' },
            { title: 'Ellerey' }
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