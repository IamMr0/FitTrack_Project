<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid px-4">
      <RouterLink class="navbar-brand fw-bold" to="/">
        💪 FitTrack
      </RouterLink>
      <button
        class="navbar-toggler"
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
        <ul class="navbar-nav ms-auto align-items-lg-center">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/news">News</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/exercises">Exercises</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/community">Community</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/about">About</RouterLink>
          </li>

          <!-- Logged In Links -->
          <template v-if="auth.isLoggedIn">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/dashboard">Dashboard</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/workouts">My Workouts</RouterLink>
            </li>
            <li class="nav-item ms-lg-2">
              <button @click="handleLogout" class="btn btn-outline-light btn-sm w-100 mt-2 mt-lg-0">
                Logout ({{ auth.user.firstName }})
              </button>
            </li>
          </template>

          <!-- Logged Out Links -->
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login">Login</RouterLink>
            </li>
            <li class="nav-item ms-lg-2">
              <RouterLink class="btn btn-success btn-sm w-100 mt-2 mt-lg-0" to="/register">
                Register
              </RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>
