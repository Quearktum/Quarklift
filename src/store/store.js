import { createStore } from 'vuex'
import axios from 'axios'

const store = createStore({
  state: {
    events: [],
    user: null,
    token: localStorage.getItem('token') || ''
  },
  getters: {
    EVENTS: state => state.events,
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user
  },
  mutations: {
    SET_EVENTS: (state, events) => {
      state.events = events;
    },
    ADD_EVENT: (state, event) => {
      state.events.push(event);
    },
    UPDATE_EVENT: (state, updatedEvent) => {
      const index = state.events.findIndex(event => event.id === updatedEvent.id);
      if (index !== -1) {
        state.events.splice(index, 1, updatedEvent);
      }
    },
    DELETE_EVENT: (state, eventId) => {
      state.events = state.events.filter(event => event.id !== eventId);
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
      localStorage.setItem('token', token);
    },
    LOGOUT: (state) => {
      state.user = null;
      state.token = '';
      localStorage.removeItem('token');
    }
  },
  actions: {
    async fetchUser({ commit }) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/user', {
            headers: { Authorization: token }
          });
          commit('SET_USER', response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    },
    async saveWorkout({ commit }, workout) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/log', workout, {
          headers: {
            Authorization: token
          }
        });
        const newEvent = { ...workout, id: response.data.id }; // Use the returned ID
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
    },
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('http://localhost:3000/login', credentials);
        const token = response.data.token;
        commit('SET_TOKEN', token);
        await this.dispatch('fetchUser');
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },
    // eslint-disable-next-line no-unused-vars
    async register({ commit }, credentials) {
      try {
        await axios.post('http://localhost:3000/register', credentials);
      } catch (error) {
        console.error('Error registering:', error);
        throw error;
      }
    },
    logout({ commit }) {
      commit('LOGOUT');
    }
  }
});

export default store;
