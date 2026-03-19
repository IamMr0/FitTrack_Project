<template>
  <div class="container-fluid py-5 px-3">
    <div class="col-12 col-md-8 col-lg-6 mx-auto">
      <h1 class="fw-bold mb-4">About FitTrack</h1>
      <p class="lead mb-5">
        FitTrack is your personal fitness companion designed to help you achieve your health goals through consistent tracking and community engagement.
      </p>

      <!-- Personalisation Card -->
      <div class="card shadow-sm p-4 mb-4">
        <h4 class="fw-bold mb-3">Personalise Your Experience</h4>
        <div class="mb-3">
          <label for="firstName" class="form-label">First Name</label>
          <input 
            id="firstName" 
            v-model.trim="user.firstName" 
            type="text" 
            class="form-control" 
            placeholder="John"
          >
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Last Name</label>
          <input 
            id="lastName" 
            v-model.trim="user.lastName" 
            type="text" 
            class="form-control" 
            placeholder="Doe"
          >
        </div>
        
        <div v-if="fullName" class="alert alert-success mt-3 mb-0">
          Welcome, <strong>{{ fullName }}</strong>! Ready to crush your goals?
        </div>
      </div>

      <!-- Environment Selector Card -->
      <div class="card shadow-sm p-4">
        <h4 class="fw-bold mb-3">Choose Your Environment</h4>
        <div class="mb-3">
          <div class="form-check form-check-inline">
            <input 
              class="form-check-input" 
              type="radio" 
              name="envOptions" 
              id="mountainRadio" 
              value="mountain" 
              v-model="environment"
            >
            <label class="form-check-label" for="mountainRadio">Mountain Training</label>
          </div>
          <div class="form-check form-check-inline">
            <input 
              class="form-check-input" 
              type="radio" 
              name="envOptions" 
              id="oceanRadio" 
              value="ocean" 
              v-model="environment"
            >
            <label class="form-check-label" for="oceanRadio">Ocean Training</label>
          </div>
        </div>

        <div class="mt-3">
          <img 
            v-if="environment === 'mountain'" 
            src="../assets/images/mountain.jpg" 
            alt="Mountain training" 
            class="img-fluid rounded shadow-sm"
            @error="handleImageError"
          >
          <img 
            v-if="environment === 'ocean'" 
            src="../assets/images/ocean.jpg" 
            alt="Ocean training" 
            class="img-fluid rounded shadow-sm"
            @error="handleImageError"
          >
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
