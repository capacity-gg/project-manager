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
    addMilestone(state, payload) {
        state.milestones.push(payload);
    },
    setMilestones(state, payload) {
        state.milestones = payload;
    }
}

const actions = {
    getMilestones({commit}) {
        var milestones = [
            { ID: 1, title: 'Presentation' },
            { ID: 2, title: 'Feedback' },
            { ID: 3, title: 'Delivery' }
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