import { createStore } from 'vuex';
import axios from 'axios';

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
    UPDATE_LIKES: (state, { id, likes }) => {
      const event = state.events.find(event => event.id === id);
      if (event) {
        event.likes = likes;
      }
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
    async fetchWorkouts({ commit }) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/workouts', {
          headers: {
            Authorization: token
          }
        });
        const events = response.data.map(workout => ({
          id: workout.id,
          title: workout.exercise,
          start: workout.date,
          allDay: true,
          exercise: workout.exercise,
          reps: workout.reps,
          sets: workout.sets,
          weight: workout.weight,
          date: workout.date,
          likes: workout.likes
        }));
        commit('SET_EVENTS', events);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        throw error;
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
        const newEvent = { ...workout, id: response.data.id };
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
    async register({ commit }, user) {
      try {
        await axios.post('http://localhost:3000/register', user);
      } catch (error) {
        console.error('Error registering:', error);
        throw error;
      }
    },
    async fetchUser({ commit }) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/user', {
          headers: {
            Authorization: token
          }
        });
        commit('SET_USER', response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    },
    async likeWorkoutAction({ commit }, id) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://localhost:3000/like/${id}`, null, {
          headers: { Authorization: token }
        });
        commit('UPDATE_LIKES', { id, likes: response.data.likes });
      } catch (error) {
        console.error('Error liking workout:', error);
        throw error;
      }
    },
    logout({ commit }) {
      commit('LOGOUT');
    }
  }
});

export default store;
