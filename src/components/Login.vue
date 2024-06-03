<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input type="text" v-model="username" placeholder="Username" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  import { login } from '../services/authService';
  
  export default {
    name: "LoginComponent",
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      async login() {
        try {
          const response = await login(this.username, this.password);
          localStorage.setItem('token', response.data.token);
          alert('Login successful!');
        } catch (error) {
          console.error(error);
          alert('Login failed!');
        }
      }
    }
  };
  </script>
  