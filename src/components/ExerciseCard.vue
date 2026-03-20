<template>
  <div class="card h-100 border-0 shadow-sm overflow-hidden exercise-card-modern">
    <div
      class="card-img-top bg-light text-center p-3 d-flex align-items-center justify-content-center position-relative"
      style="height: 220px"
    >
      <img
        v-if="exercise.id"
        :src="getExerciseGifUrl(exercise.id)"
        :alt="exercise.name"
        class="img-fluid"
        style="max-height: 100%; mix-blend-mode: multiply;"
      />
      <div v-else class="text-muted display-4 opacity-25">💪</div>
      <div class="position-absolute top-0 end-0 p-3">
        <span class="badge bg-white text-primary rounded-pill shadow-sm">ID #{{ exercise.id }}</span>
      </div>
    </div>
    <div class="card-body p-4 d-flex flex-column">
      <div class="d-flex flex-wrap gap-2 mb-3">
        <span class="badge bg-primary-light text-primary px-3 rounded-pill text-capitalize">{{ exercise.bodyPart }}</span>
        <span class="badge bg-light text-muted px-3 rounded-pill text-capitalize border">{{ exercise.target }}</span>
      </div>
      <h5 class="card-title fw-bold text-capitalize mb-3">{{ exercise.name }}</h5>
      <div class="mt-auto pt-3 border-top">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="small">
            <div class="text-muted text-uppercase" style="font-size: 0.65rem">Equipment</div>
            <div class="fw-bold text-dark text-capitalize">{{ exercise.equipment }}</div>
          </div>
          <div class="small text-end">
            <div class="text-muted text-uppercase" style="font-size: 0.65rem">Difficulty</div>
            <div class="fw-bold text-primary text-capitalize">{{ exercise.difficulty || 'beginner' }}</div>
          </div>
        </div>
        <button
          @click="$emit('showDetails', exercise)"
          class="btn btn-primary btn-sm w-100 fw-bold py-2 rounded-3"
          data-bs-toggle="modal"
          data-bs-target="#exerciseModal"
        >
          Explore Details
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getExerciseGifUrl } from '../api/exerciseApi'

defineProps({
  exercise: {
    type: Object,
    required: true
  }
})

defineEmits(['showDetails'])
</script>

<style scoped>
.bg-primary-light {
  background-color: var(--primary-light);
}

.exercise-card-modern {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.exercise-card-modern:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}
</style>
