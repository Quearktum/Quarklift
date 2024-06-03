<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "RegisterComponent",
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    ...mapActions(['register']),
    async handleRegister() {
      try {
        await this.register({ username: this.username, password: this.password });
        alert('Registration successful!');
        this.$router.push('/login');
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.errorMessage = 'Username already exists';
        } else {
          this.errorMessage = 'Registration failed';
        }
        console.error('Error registering:', error);
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
