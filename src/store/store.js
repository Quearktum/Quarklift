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
        },
        UPDATE_EVENT: (state, updatedEvent) => {
            const index = state.events.findIndex(event => event.id === updatedEvent.id);
            if (index !== -1) {
                state.events.splice(index, 1, updatedEvent);
            }
        },
        DELETE_EVENT: (state, eventId) => {
            state.events = state.events.filter(event => event.id !== eventId);
        }
    },
    actions: {
        async saveWorkout({ commit }, workout) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post('http://localhost:3000/log', workout, {
                    headers: {
                        Authorization: token
                    }
                });
                const newEvent = { ...workout, id: response.data.id }; // Use the returned ID
                console.log('New event with ID:', newEvent); 

                commit('ADD_EVENT', newEvent);
            } catch (error) {
                console.error('Error saving workout:', error);
                throw error;
            }
        },
        async updateWorkout({ commit }, workout) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:3000/log/${workout.id}`, workout, {
                    headers: {
                        Authorization: token
                    }
                });
                commit('UPDATE_EVENT', workout);
            } catch (error) {
                console.error('Error updating workout:', error);
                throw error;
            }
        },
        async deleteWorkout({ commit }, eventId) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/log/${eventId}`, {
                    headers: {
                        Authorization: token
                    }
                });
                commit('DELETE_EVENT', eventId);
            } catch (error) {
                console.error('Error deleting workout:', error);
                throw error;
            }
        }
    }
});

export default store;
