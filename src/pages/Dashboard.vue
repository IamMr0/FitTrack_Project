<template>
  <div class="container-fluid py-5 px-3">
    <div class="mb-5">
      <h1 class="fw-bold">Welcome back, {{ auth.user?.firstName }}!</h1>
      <p class="text-muted">Here is your fitness overview.</p>
    </div>

    <!-- Stats Row -->
    <div class="row g-4 mb-5">
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card h-100 shadow-sm border-success border-start border-4">
          <div class="card-body">
            <h6 class="text-muted small text-uppercase fw-bold">Workouts Logged</h6>
            <div class="display-6 fw-bold">{{ filteredUserWorkouts.length }}</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card h-100 shadow-sm border-primary border-start border-4">
          <div class="card-body">
            <h6 class="text-muted small text-uppercase fw-bold">Total Sets</h6>
            <div class="display-6 fw-bold">{{ totalSets }}</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card h-100 shadow-sm border-warning border-start border-4">
          <div class="card-body">
            <h6 class="text-muted small text-uppercase fw-bold">Total Reps</h6>
            <div class="display-6 fw-bold">{{ totalReps }}</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card h-100 shadow-sm border-info border-start border-4">
          <div class="card-body">
            <h6 class="text-muted small text-uppercase fw-bold">Muscles Hit</h6>
            <div class="display-6 fw-bold">{{ uniqueMuscles }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-5">
      <!-- Workouts by Type -->
      <div class="col-12 col-lg-4">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="fw-bold mb-4">Workouts by Type</h5>
            <div v-if="Object.keys(statsByType).length" class="d-flex flex-wrap gap-2 mb-4">
              <span v-for="(count, type) in statsByType" :key="type" class="badge bg-secondary py-2 px-3">
                {{ type }}: {{ count }}
              </span>
            </div>
            <div v-else class="text-muted small mb-4 italic">No workout types recorded yet.</div>
            
            <p class="mb-0 fw-bold">Weekly Volume:</p>
            <p class="text-muted">{{ weeklyVolume }} total reps in last 7 days</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="col-12 col-lg-8">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="fw-bold mb-4">Recent Workouts</h5>
            <div v-if="recentWorkouts.length">
              <div v-for="w in recentWorkouts" :key="w.id" class="border-bottom py-3 d-flex justify-content-between align-items-center">
                <div>
                  <div class="fw-bold">{{ w.exercise }}</div>
                  <div class="text-muted small">{{ w.date }} — {{ w.sets }}x{{ w.reps }} ({{ w.weight }}kg)</div>
                </div>
                <span class="badge bg-light text-dark border">{{ w.muscle }}</span>
              </div>
              <div class="mt-4 text-center">
                <RouterLink to="/workouts" class="btn btn-success btn-sm">View Full Log</RouterLink>
              </div>
            </div>
            <div v-else class="alert alert-light border text-center py-4">
              <p class="mb-3">You haven't logged any workouts yet.</p>
              <RouterLink to="/workouts" class="btn btn-success btn-sm">Log Your First Workout</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/authStore'
import { useWorkoutStore } from '../stores/workoutStore'

const auth = useAuthStore()
const workoutStore = useWorkoutStore()

const { filteredUserWorkouts, statsByType, weeklyVolume } = storeToRefs(workoutStore)

const totalSets = computed(() => filteredUserWorkouts.value.reduce((acc, w) => acc + w.sets, 0))
const totalReps = computed(() => filteredUserWorkouts.value.reduce((acc, w) => acc + (w.sets * w.reps), 0))
const uniqueMuscles = computed(() => new Set(filteredUserWorkouts.value.map(w => w.muscle)).size)

const recentWorkouts = computed(() => filteredUserWorkouts.value.slice(0, 5))
</script>
