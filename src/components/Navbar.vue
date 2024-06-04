<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/dashboard">QuarkLift</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/browse">Browse</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/leaderboard">Leaderboard</router-link>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <a class="nav-link" href="#" @click.prevent="handleLogout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "NavBar",
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout();
      this.$router.push('/login'); 
    }
  },
};
</script>

<style scoped>
.navbar-toggler {
  width: 50px;
  height: 50px;
  padding: 0;
  border-radius: 50%;
  transition: 0.3s ease-in-out;
  flex-shrink: 0;
}
.navbar-toggler:focus {
  box-shadow: none;
}

.navbar-dark .navbar-toggler {
  background-color: #212529;
}

.navbar-collapse {
  background: #212529;
}

@media screen and (max-width: 991px) {
  .navbar-collapse.collapse:not(.show) {
    display: block;
  }
  .navbar-collapse {
    position: fixed;
    top: 0;
    left: 0;
    background: #212529;
    width: 215px;
    height: 100%;
    z-index: 9999;
    padding: 25px;
    transform: translateX(-215px);
    transition: 0.5s ease-in-out;
    display: block;
  }
  .navbar-collapse.show {
    transform: translateX(0px);
  }
  .nav-overlay {
    position: absolute;
    background: #0000007d;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 2;
    transform: translateX(-100vw);
    transition: 0.5s ease-in-out;
    display: block;
  }
  .nav-overlay.active {
    transform: translateX(0);
  }
}
</style>
