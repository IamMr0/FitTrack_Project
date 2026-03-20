<template>
  <div class="container-fluid py-5 px-lg-5 fade-in">
    <div class="mb-5">
      <h1 class="display-5 fw-bold mb-1">Welcome back, {{ auth.user?.firstName }}!</h1>
      <p class="text-muted mb-0">Your fitness journey at a glance.</p>
    </div>

    <!-- Stats Row -->
    <div class="row g-4 mb-5">
      <div v-for="stat in stats" :key="stat.label" class="col-12 col-sm-6 col-lg-3">
        <div class="card h-100 border-0 shadow-sm overflow-hidden stat-card">
          <div :class="['card-indicator', stat.colorClass]"></div>
          <div class="card-body p-4">
            <h6 class="text-muted small text-uppercase fw-bold tracking-widest mb-2">{{ stat.label }}</h6>
            <div class="display-6 fw-bold text-dark">{{ stat.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-5">
      <!-- Workouts by Type -->
      <div class="col-12 col-lg-4">
        <div class="card h-100 border-0 shadow-sm overflow-hidden">
          <div class="card-body p-4 p-xl-5">
            <h5 class="fw-bold mb-4">Training Style</h5>
            <div v-if="Object.keys(statsByType).length" class="d-flex flex-wrap gap-2 mb-4">
              <span v-for="(count, type) in statsByType" :key="type" class="badge bg-primary-light text-primary py-2 px-3 rounded-pill border-0">
                {{ type }}: {{ count }}
              </span>
            </div>
            <div v-else class="text-muted small mb-4 font-italic">No activities recorded yet.</div>
            
            <div class="mt-auto pt-4 border-top">
              <p class="mb-1 fw-bold text-dark">Weekly Volume</p>
              <p class="text-muted small mb-0">{{ weeklyVolume }} total reps in last 7 days</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="col-12 col-lg-8">
        <div class="card h-100 border-0 shadow-sm overflow-hidden">
          <div class="card-body p-4 p-xl-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold mb-0">Recent Activity</h5>
              <RouterLink to="/workouts" class="btn btn-link text-primary fw-bold text-decoration-none p-0">
                View All <span class="ms-1">→</span>
              </RouterLink>
            </div>

            <div v-if="recentWorkouts.length" class="d-flex flex-column gap-2">
              <WorkoutCard 
                v-for="w in recentWorkouts" 
                :key="w.id" 
                :workout="w" 
                :showActions="false"
              />
            </div>
            <div v-else class="glass p-5 rounded-4 text-center border-0">
              <p class="mb-4 text-muted">Ready to start your journey?</p>
              <RouterLink to="/workouts" class="btn btn-primary px-5 py-3 rounded-pill shadow">
                Log Your First Workout
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="d-flex flex-wrap gap-3">
      <RouterLink to="/workouts" class="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm">
        Log Workout
      </RouterLink>
      <RouterLink to="/exercises" class="btn btn-outline-primary px-4 py-2 rounded-pill fw-bold">
        Browse Exercises
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/authStore'
import { useWorkoutStore } from '../stores/workoutStore'
import WorkoutCard from '../components/WorkoutCard.vue'

const auth = useAuthStore()
const workoutStore = useWorkoutStore()

const { filteredUserWorkouts, statsByType, weeklyVolume } = storeToRefs(workoutStore)

const totalSets = computed(() => filteredUserWorkouts.value.reduce((acc, w) => acc + w.sets, 0))
const totalReps = computed(() => filteredUserWorkouts.value.reduce((acc, w) => acc + (w.sets * w.reps), 0))
const uniqueMuscles = computed(() => new Set(filteredUserWorkouts.value.map(w => w.muscle)).size)

const recentWorkouts = computed(() => [...filteredUserWorkouts.value].reverse().slice(0, 5))

const stats = computed(() => [
  { label: 'Workouts', value: filteredUserWorkouts.value.length, colorClass: 'bg-primary' },
  { label: 'Total Sets', value: totalSets.value, colorClass: 'bg-info' },
  { label: 'Total Reps', value: totalReps.value, colorClass: 'bg-warning' },
  { label: 'Muscles Hit', value: uniqueMuscles.value, colorClass: 'bg-success' }
])
</script>

<style scoped>
.stat-card {
  position: relative;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.card-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.bg-primary-light {
  background-color: var(--primary-light);
}

.bg-accent {
  background-color: var(--accent);
}

.tracking-widest {
  letter-spacing: 0.1em;
}

.workout-item {
  transition: background-color 0.2s ease;
}

.workout-item:hover {
  background-color: var(--primary-light);
  border-radius: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>
