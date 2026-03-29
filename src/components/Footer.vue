<template>
  <footer class="bg-white border-top py-5 mt-auto">
    <div class="container-fluid px-lg-5">
      <div class="row g-4 justify-content-between">
        <div class="col-12 col-md-4">
          <div class="d-flex align-items-center mb-3">
            <span class="fs-4 me-2">💪</span>
            <span class="fw-bold fs-4 text-primary tracking-tighter">FitTrack</span>
          </div>
          <p class="text-muted small mb-4">
            Your personal fitness companion designed to help you achieve your health goals through consistent tracking and community engagement. 
          </p>
          <div class="d-flex gap-3">
            <a href="#" class="btn btn-light btn-sm rounded-circle shadow-sm hover-lift-subtle" aria-label="Facebook">📘</a>
            <a href="#" class="btn btn-light btn-sm rounded-circle shadow-sm hover-lift-subtle" aria-label="Twitter">🐦</a>
            <a href="#" class="btn btn-light btn-sm rounded-circle shadow-sm hover-lift-subtle" aria-label="Instagram">📸</a>
            <a href="#" class="btn btn-light btn-sm rounded-circle shadow-sm hover-lift-subtle" aria-label="LinkedIn">💼</a>
          </div>
        </div>
        
        <div class="col-6 col-md-2">
          <h6 class="fw-bold mb-3 text-dark">Platform</h6>
          <ul class="list-unstyled d-flex flex-column gap-2 small">
            <li><RouterLink to="/exercises" class="text-muted text-decoration-none hover-primary transition-all">Exercises</RouterLink></li>
            <li><RouterLink to="/news" class="text-muted text-decoration-none hover-primary transition-all">News Blog</RouterLink></li>
            <li><RouterLink to="/community" class="text-muted text-decoration-none hover-primary transition-all">Community</RouterLink></li>
          </ul>
        </div>

        <div class="col-6 col-md-2">
          <h6 class="fw-bold mb-3 text-dark">Company</h6>
          <ul class="list-unstyled d-flex flex-column gap-2 small">
            <li><RouterLink to="/about" class="text-muted text-decoration-none hover-primary transition-all">About Us</RouterLink></li>
            <li><a href="#" class="text-muted text-decoration-none hover-primary transition-all">Privacy Policy</a></li>
            <li><a href="#" class="text-muted text-decoration-none hover-primary transition-all">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div class="row mt-5 pt-4 border-top">
        <div class="col-12">
          <p class="text-center text-muted small mb-0">
            &copy; {{ new Date().getFullYear() }} FitTrack Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.hover-lift-subtle {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
.hover-lift-subtle:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-sm);
}

.hover-primary:hover {
  color: var(--primary) !important;
}

.tracking-tighter {
  letter-spacing: -0.05em;
}
</style>
