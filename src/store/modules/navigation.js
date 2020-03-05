const namespaced = true;

const state = {
    isVisible: false
}

const getters = {
    isNavigationVisible(state, getters, rootState, rootGetters) {
        return state.isVisible;
    }
}

const mutations = {
    setNavigationVisibility(state, payload) {
        state.isVisible = payload;
    },
    toggleNavigationVisibility(state) {
        state.isVisible = !state.isVisible;
    }
}

const actions = {
    
}

export default {
    namespaced,
    state,
    mutations,
    actions,
    getters
};