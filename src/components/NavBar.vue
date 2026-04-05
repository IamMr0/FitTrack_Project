<template>
  <nav class="navbar navbar-expand-lg navbar-light glass sticky-top shadow-sm">
    <div class="container-fluid px-4">
      <RouterLink class="navbar-brand fw-bold d-flex align-items-center" to="/">
        <span class="me-2 text-primary">💪</span>
        <span class="brand-text">FitTrack</span>
      </RouterLink>
      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMenu"
        aria-controls="navMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-2">
          <li class="nav-item">
            <RouterLink class="nav-link px-3" to="/">Home</RouterLink>
          </li>
           <li class="nav-item">
            <RouterLink class="nav-link px-3" to="/about">About</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link px-3" to="/news">News</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link px-3" to="/community">Community</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link px-3" to="/exercises">Exercises</RouterLink>
          </li>
          
          <!-- Logged In Links -->
          <template v-if="auth.isLoggedIn">
            <li class="nav-item">
              <RouterLink class="nav-link px-3" to="/dashboard">Dashboard</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link px-3" to="/workouts">My Workouts</RouterLink>
            </li>
            <li class="nav-item ms-lg-2">
              <button @click="handleLogout" class="btn btn-outline-primary btn-sm px-3 rounded-pill">
                Logout
              </button>
            </li>
          </template>

          <!-- Logged Out Links -->
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link px-3" to="/login">Login</RouterLink>
            </li>
            <li class="nav-item ms-lg-2">
              <RouterLink class="btn btn-primary btn-sm px-4 rounded-pill fw-bold" to="/register">
                Get Started
              </RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  transition: all 0.3s ease;
  padding: 0.75rem 0;
}

.navbar-brand {
  font-size: 1.5rem;
  letter-spacing: -0.5px;
}

.brand-text {
  background: linear-gradient(45deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-link {
  font-weight: 500;
  color: var(--text) !important;
  transition: color 0.2s ease;
}

.nav-link:hover, .router-link-active {
  color: var(--primary) !important;
}

.nav-link.router-link-active {
  position: relative;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 1rem;
  right: 1rem;
  height: 2px;
  background-color: var(--primary);
  border-radius: 2px;
}
</style>

<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../stores/authStore'

export default {
  name: 'NavBar',
  computed: {
    ...mapStores(useAuthStore),
    auth() { return this.authStore }
  },
  methods: {
    handleLogout() {
      this.authStore.logout()
      this.$router.push('/')
    }
  }
}
</script>
