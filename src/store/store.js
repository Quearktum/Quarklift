import { createStore } from 'vuex'
import axios from 'axios'

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
    actions: {
        async saveWorkout({ commit }, workout) {
            try {
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:3000/log', workout, {
                    headers: {
                        Authorization: token
                    }
                });
                commit('ADD_EVENT', workout);
            } catch (error) {
                console.error('Error saving workout:', error);
                throw error;
            }
        }
    }
});

export default store;
