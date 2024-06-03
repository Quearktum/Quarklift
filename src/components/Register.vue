<template>
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <input type="text" v-model="username" placeholder="Username" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import { register } from '../services/authService';
  
  export default {
    name: "RegisterComponent",
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      async register() {
        try {
          await register(this.username, this.password);
          alert('Registration successful!');
        } catch (error) {
          console.error(error);
          alert('Registration failed!');
        }
      }
    }
  };
  </script>
  