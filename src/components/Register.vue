<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="mb-4 text-center">Register</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <input type="text" class="form-control" v-model="username" placeholder="Username" required />
          </div>
          <div class="mb-3">
            <input type="password" class="form-control" v-model="password" placeholder="Password" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Register</button>
        </form>
        <p v-if="errorMessage" class="error mt-3">{{ errorMessage }}</p>
      </div>
    </div>
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
  text-align: center;
}
</style>
