<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "LoginComponent",
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      try {
        await this.login({ username: this.username, password: this.password });
        this.$router.push('/dashboard');
      } catch (error) {
        this.errorMessage = 'Login failed!';
        console.error('Error logging in:', error);
      }
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
