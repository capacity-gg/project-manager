const namespaced = true;

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
    }
}

const actions = {
    getMilestones({commit}) {
        var milestones = [
            { title: 'Presentation' },
            { title: 'Feedback' },
            { title: 'Delivery' }
        ];
  
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commit('setMilestones', milestones);
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