import { createStore } from 'vuex'

const store = createStore({
    state: {
        events: []
    },
    getters: {
        EVENTS: state => state.events
    },
    mutations: {
        ADD_EVENT: (state, event) => {
            state.events.push(event)
        }
    },
    actions: {}
})

export default store;
