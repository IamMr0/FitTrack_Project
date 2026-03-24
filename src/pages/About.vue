<template>
  <div class="container-fluid py-5 px-lg-5 fade-in">
    <div class="col-12 col-md-8 col-lg-6 mx-auto text-center mb-5">
      <h1 class="display-4 fw-bold mb-3">About FitTrack</h1>
      <p class="lead text-muted">
        FitTrack is your personal fitness companion designed to help you achieve your health goals through consistent tracking and community engagement.
      </p>
    </div>

    <div class="col-12 col-md-8 col-lg-6 mx-auto">
      <!-- Personalisation Card -->
      <div class="glass p-4 p-lg-5 rounded-4 mb-5 shadow-sm border-0">
        <h4 class="fw-bold mb-4 d-flex align-items-center gap-2">
          <span class="text-primary">👤</span> Personalize Your Experience
        </h4>
        <div class="row g-3">
          <div class="col-12 col-sm-6">
            <label for="firstName" class="form-label small fw-bold text-muted text-uppercase tracking-wider">First Name</label>
            <input 
              id="firstName" 
              v-model.trim="user.firstName" 
              type="text" 
              class="form-control py-2 rounded-3" 
              placeholder="e.g. John"
            >
          </div>
          <div class="col-12 col-sm-6">
            <label for="lastName" class="form-label small fw-bold text-muted text-uppercase tracking-wider">Last Name</label>
            <input 
              id="lastName" 
              v-model.trim="user.lastName" 
              type="text" 
              class="form-control py-2 rounded-3" 
              placeholder="e.g. Doe"
            >
          </div>
        </div>
        
        <div v-if="fullName" class="mt-4 p-3 bg-primary-light rounded-3 border-start border-primary border-4 slide-up">
          <div class="fw-bold text-primary">Welcome, {{ fullName }}!</div>
          <div class="small text-muted">Ready to crush your goals today?</div>
        </div>
      </div>

      <!-- Environment Selector Card -->
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="card-body p-4 p-lg-5">
          <h4 class="fw-bold mb-4 d-flex align-items-center gap-2">
            <span class="text-primary">🌄</span> Choose Your Vibe
          </h4>
          <div class="d-flex gap-4 mb-4">
            <div class="form-check custom-radio">
              <input 
                class="form-check-input" 
                type="radio" 
                name="envOptions" 
                id="mountainRadio" 
                value="mountain" 
                v-model="environment"
              >
              <label class="form-check-label fw-medium" for="mountainRadio">Highlands</label>
            </div>
            <div class="form-check custom-radio">
              <input 
                class="form-check-input" 
                type="radio" 
                name="envOptions" 
                id="oceanRadio" 
                value="ocean" 
                v-model="environment"
              >
              <label class="form-check-label fw-medium" for="oceanRadio">Coastal</label>
            </div>
          </div>

          <div class="overflow-hidden rounded-4 shadow-sm transition-all">
            <img 
              v-if="environment === 'mountain'" 
              src="../assets/images/outdoor.png" 
              alt="Mountain training" 
              class="img-fluid fade-in"
              @error="handleImageError"
            >
            <img 
              v-if="environment === 'ocean'" 
              src="../assets/images/indoor.png" 
              alt="Ocean training" 
              class="img-fluid fade-in"
              @error="handleImageError"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const user = reactive({
  firstName: '',
  lastName: ''
})

const environment = ref('mountain')

const fullName = computed(() => {
  const first = user.firstName
  const last = user.lastName
  return (first || last) ? `${first} ${last}`.trim() : ''
})

const handleImageError = (e) => {
  e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found'
  e.target.classList.add('opacity-50')
}
</script>
