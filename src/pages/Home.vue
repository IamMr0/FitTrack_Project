<template>
  <div>
    <!-- Hero Section -->
    <header class="py-5 text-center bg-dark text-white">
      <div class="container-fluid py-lg-5 px-4">
        <h1 class="display-4 fw-bold mb-3">Track Your Gains</h1>
        <p class="lead mb-4">
          The all-in-one platform to track your workouts, browse exercises, and stay updated with the latest fitness news.
        </p>
        <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <a href="#" class="btn btn-success btn-lg px-4 gap-3">Get Started</a>
          <a href="#" class="btn btn-outline-light btn-lg px-4">Browse Exercises</a>
        </div>
      </div>
    </header>

    <!-- Why FitTrack Section -->
    <section class="py-5">
      <div class="container-fluid px-lg-5">
        <div class="row align-items-center g-5">
          <div class="col-12 col-md-6">
            <img 
              src="../assets/images/hero.jpg" 
              alt="Fitness training" 
              class="img-fluid rounded shadow"
              @error="handleImageError"
            >
          </div>
          <div class="col-12 col-md-6">
            <h2 class="fw-bold mb-4">Why FitTrack?</h2>
            <ul class="list-unstyled">
              <li class="mb-3 d-flex align-items-start">
                <span class="badge bg-success me-2 mt-1">✓</span>
                <span>Track every set, rep, and weight with ease.</span>
              </li>
              <li class="mb-3 d-flex align-items-start">
                <span class="badge bg-success me-2 mt-1">✓</span>
                <span>Access a massive database of exercises.</span>
              </li>
              <li class="mb-3 d-flex align-items-start">
                <span class="badge bg-success me-2 mt-1">✓</span>
                <span>Join a community of like-minded fitness enthusiasts.</span>
              </li>
              <li class="mb-3 d-flex align-items-start">
                <span class="badge bg-success me-2 mt-1">✓</span>
                <span>Visualise your progress with detailed stats.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Card Grid Section -->
    <section class="py-5 bg-light">
      <div class="container-fluid px-lg-5">
        <div class="row g-4 justify-content-center">
          <div class="col-12 col-sm-6 col-lg-4">
            <div class="card h-100 shadow-sm border-0">
              <img 
                src="../assets/images/mountain.jpg" 
                class="card-img-top" 
                alt="Outdoor training"
                @error="handleImageError"
              >
              <div class="card-body p-4">
                <h5 class="card-title fw-bold">Outdoor Training</h5>
                <p class="card-text text-muted">Discover the best outdoor workouts to keep your routine fresh and exciting.</p>
                <span class="badge bg-success">Adventure</span>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-lg-4">
            <div class="card h-100 shadow-sm border-0">
              <img 
                src="../assets/images/ocean.jpg" 
                class="card-img-top" 
                alt="Water sports"
                @error="handleImageError"
              >
              <div class="card-body p-4">
                <h5 class="card-title fw-bold">Water Sports</h5>
                <p class="card-text text-muted">Improve your cardio and strength with our curated list of aquatic activities.</p>
                <span class="badge bg-success">Cardio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const handleImageError = (e) => {
  e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found'
  e.target.classList.add('opacity-50')
}
</script>

<style scoped>
.hero-image {
  max-height: 400px;
  object-fit: cover;
}
</style>
