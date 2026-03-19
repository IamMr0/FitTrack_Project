<template>
  <div class="fade-in">
    <!-- Hero Section -->
    <header class="hero-section text-center text-white d-flex align-items-center justify-content-center">
      <div class="container-fluid py-lg-5 px-4 position-relative z-1">
        <h1 class="display-3 fw-bold mb-3 ls-tight">Track Your Gains</h1>
        <p class="lead mb-5 mx-auto max-w-2xl text-white-50">
          The all-in-one platform to track your workouts, browse exercises, and stay updated with the latest fitness news.
        </p>
        <div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
          <RouterLink to="/register" class="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-lg">
            Get Started Free
          </RouterLink>
          <RouterLink to="/exercises" class="btn btn-outline-light btn-lg px-5 py-3 rounded-pill glass">
            Browse Exercises
          </RouterLink>
        </div>
      </div>
      <!-- Abstract Background Shapes -->
      <div class="hero-shape shape-1"></div>
      <div class="hero-shape shape-2"></div>
    </header>

    <!-- Why FitTrack Section -->
    <section class="py-5 my-5">
      <div class="container-fluid px-lg-5">
        <div class="row align-items-center g-5">
          <div class="col-12 col-md-6 order-2 order-md-1">
            <div class="pe-lg-5">
              <h2 class="display-5 fw-bold mb-4">Why Choose FitTrack?</h2>
              <p class="text-muted mb-4 lead">Transform your fitness journey with data-driven insights and a supportive community.</p>
              <div class="row g-4">
                <div v-for="(feature, idx) in features" :key="idx" class="col-12 col-sm-6">
                  <div class="d-flex align-items-center gap-3">
                    <div class="feature-icon-sm bg-primary-light text-primary">
                      <i class="bi bi-check-lg">✓</i>
                    </div>
                    <span class="fw-medium">{{ feature }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 order-1 order-md-2">
            <div class="position-relative">
              <img 
                src="../assets/images/hero.jpg" 
                alt="Fitness training" 
                class="img-fluid rounded-4 shadow-2xl"
                @error="handleImageError"
              >
              <div class="position-absolute bottom-0 start-0 translate-middle-x ms-5 mb-n4 d-none d-lg-block">
                <div class="glass p-4 rounded-3 shadow border-0">
                  <div class="text-primary fw-bold display-6">1000+</div>
                  <div class="small fw-bold text-uppercase tracking-wider">Exercises</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Activities -->
    <section class="py-5 bg-white border-top border-bottom">
      <div class="container-fluid px-lg-5">
        <div class="text-center mb-5">
          <h2 class="fw-bold">Explore Diverse Workouts</h2>
          <p class="text-muted">Tailor your training to your environment and goals.</p>
        </div>
        <div class="row g-4 justify-content-center">
          <div v-for="act in activities" :key="act.title" class="col-12 col-sm-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm overflow-hidden group">
              <div class="overflow-hidden">
                <img 
                  :src="act.img" 
                  class="card-img-top transition-transform group-hover:scale-110" 
                  :alt="act.title"
                  @error="handleImageError"
                >
              </div>
              <div class="card-body p-4">
                <span class="badge bg-primary-light text-primary px-3 py-2 rounded-pill mb-3">{{ act.tag }}</span>
                <h5 class="card-title fw-bold">{{ act.title }}</h5>
                <p class="card-text text-muted small">{{ act.desc }}</p>
                <RouterLink :to="act.link" class="btn btn-link text-primary p-0 fw-bold text-decoration-none">
                  Learn More <span class="ms-1">→</span>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const features = [
  'Precision Activity Tracking',
  '1000+ Exercise Database',
  'Weekly Progress Reports',
  'Global Fitness Community',
  'Personalized Workout Plans',
  'Nutrition & Diet Tracking'
]

const activities = [
  {
    title: 'Outdoor Training',
    desc: 'Discover the best outdoor workouts to keep your routine fresh and exciting.',
    tag: 'Adventure',
    img: '../assets/images/mountain.jpg',
    link: '/exercises'
  },
  {
    title: 'Water Sports',
    desc: 'Improve your cardio and strength with our curated list of aquatic activities.',
    tag: 'Cardio',
    img: '../assets/images/ocean.jpg',
    link: '/exercises'
  }
]

const handleImageError = (e) => {
  e.target.src = 'https://placehold.co/600x400?text=Fitness+Activity'
  e.target.classList.add('opacity-50')
}
</script>

<style scoped>
.hero-section {
  min-height: 80vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  position: relative;
  overflow: hidden;
}

.max-w-2xl { max-width: 42rem; }
.ls-tight { letter-spacing: -0.05em; }
.shadow-2xl { shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }

.hero-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.4;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: var(--primary);
  top: -100px;
  right: -100px;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: var(--accent);
  bottom: -50px;
  left: -50px;
}

.feature-icon-sm {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.bg-primary-light {
  background-color: var(--primary-light);
}

.group-hover\:scale-110:hover {
  transform: scale(1.1);
}

.transition-transform {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
