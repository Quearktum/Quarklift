<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="mb-4 text-center">Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <input type="text" class="form-control" v-model="username" placeholder="Username" required />
          </div>
          <div class="mb-3">
            <input type="password" class="form-control" v-model="password" placeholder="Password" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
        <p v-if="errorMessage" class="error mt-3">{{ errorMessage }}</p>
      </div>
    </div>
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
  text-align: center;
}
</style>
