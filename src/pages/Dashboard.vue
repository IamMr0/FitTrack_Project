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

    <!-- Charts Row -->
    <div class="row g-4 mb-5">
      <!-- Weekly Activity Bar Chart -->
      <div class="col-12 col-lg-8">
        <div class="card border-0 shadow-sm overflow-hidden">
          <div class="card-body p-4 p-xl-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold mb-0">Weekly Activity</h5>
              <span class="badge bg-primary-light text-primary rounded-pill px-3 py-2">Last 7 Days</span>
            </div>
            <div style="height: 280px;">
              <Bar v-if="weeklyChartData.datasets[0].data.some(v => v > 0)" :data="weeklyChartData" :options="barOptions" />
              <div v-else class="d-flex align-items-center justify-content-center h-100 text-muted">
                <div class="text-center">
                  <div class="display-4 opacity-25 mb-2">📊</div>
                  <p class="mb-0">Log workouts to see your weekly chart</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Training Style Doughnut -->
      <div class="col-12 col-lg-4">
        <div class="card h-100 border-0 shadow-sm overflow-hidden">
          <div class="card-body p-4 p-xl-5">
            <h5 class="fw-bold mb-4">Training Split</h5>
            <div v-if="Object.keys(statsByType).length" style="height: 220px;">
              <Doughnut :data="doughnutData" :options="doughnutOptions" />
            </div>
            <div v-else class="text-muted small text-center py-5">
              <div class="display-4 opacity-25 mb-2">🍩</div>
              <p class="mb-0">No data yet</p>
            </div>
            <div class="mt-4 pt-3 border-top">
              <p class="mb-1 fw-bold text-dark">Weekly Volume</p>
              <p class="text-muted small mb-0">{{ weeklyVolume }} total reps in last 7 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Monthly Volume Line Chart -->
    <div class="row g-4 mb-5">
      <div class="col-12">
        <div class="card border-0 shadow-sm overflow-hidden">
          <div class="card-body p-4 p-xl-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold mb-0">Monthly Volume Trend</h5>
              <span class="badge bg-primary-light text-primary rounded-pill px-3 py-2">Last 30 Days</span>
            </div>
            <div style="height: 250px;">
              <Line v-if="monthlyChartData.datasets[0].data.some(v => v > 0)" :data="monthlyChartData" :options="lineOptions" />
              <div v-else class="d-flex align-items-center justify-content-center h-100 text-muted">
                <div class="text-center">
                  <div class="display-4 opacity-25 mb-2">📈</div>
                  <p class="mb-0">Keep training to see your monthly trend</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Personal Records -->
    <div class="row g-4 mb-5">
      <div class="col-12 col-lg-6">
        <div class="card border-0 shadow-sm overflow-hidden">
          <div class="card-body p-4 p-xl-5">
            <h5 class="fw-bold mb-4">🏆 Personal Records</h5>
            <div v-if="personalRecords.length" class="d-flex flex-column gap-3">
              <div v-for="pr in personalRecords" :key="pr.exercise" class="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                <div>
                  <span class="fw-bold text-dark text-capitalize">{{ pr.exercise }}</span>
                  <div class="text-muted small">{{ pr.date }}</div>
                </div>
                <div class="text-end">
                  <span class="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">{{ pr.weight }} kg</span>
                  <div class="text-muted small mt-1">{{ pr.sets }}×{{ pr.reps }}</div>
                </div>
              </div>
            </div>
            <div v-else class="text-muted text-center py-4">
              <div class="display-4 opacity-25 mb-2">🏋️</div>
              <p class="mb-0">Log workouts with weight to track your PRs</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="col-12 col-lg-6">
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Bar, Doughnut, Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler)

const auth = useAuthStore()
const workoutStore = useWorkoutStore()

const { filteredUserWorkouts, statsByType, weeklyVolume } = storeToRefs(workoutStore)

// All user workouts (unfiltered)
const allUserWorkouts = computed(() => {
  if (!auth.user) return []
  return workoutStore.workouts.filter(w => w.userId === auth.user.id)
})

const totalSets = computed(() => allUserWorkouts.value.reduce((acc, w) => acc + w.sets, 0))
const totalReps = computed(() => allUserWorkouts.value.reduce((acc, w) => acc + (w.sets * w.reps), 0))
const uniqueMuscles = computed(() => new Set(allUserWorkouts.value.map(w => w.muscle)).size)
const totalCalories = computed(() => allUserWorkouts.value.reduce((acc, w) => acc + (w.sets * w.reps * 0.5), 0).toFixed(0))

const recentWorkouts = computed(() => {
  return [...allUserWorkouts.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

const stats = computed(() => [
  { label: 'Workouts', value: allUserWorkouts.value.length, colorClass: 'bg-primary' },
  { label: 'Total Sets', value: totalSets.value, colorClass: 'bg-info' },
  { label: 'Total Reps', value: totalReps.value, colorClass: 'bg-warning' },
  { label: 'Est. Calories', value: `${totalCalories.value}`, colorClass: 'bg-success' }
])

// ──── Personal Records (heaviest weight per exercise) ────
const personalRecords = computed(() => {
  const prMap = {}
  allUserWorkouts.value.forEach(w => {
    if (w.weight > 0) {
      if (!prMap[w.exercise] || w.weight > prMap[w.exercise].weight) {
        prMap[w.exercise] = { exercise: w.exercise, weight: w.weight, sets: w.sets, reps: w.reps, date: w.date }
      }
    }
  })
  return Object.values(prMap).sort((a, b) => b.weight - a.weight).slice(0, 5)
})

// ──── Weekly Bar Chart (last 7 days) ────
const weeklyChartData = computed(() => {
  const days = []
  const volumes = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
    days.push(dayName)
    const dayVolume = allUserWorkouts.value
      .filter(w => w.date === dateStr)
      .reduce((sum, w) => sum + (w.sets * w.reps), 0)
    volumes.push(dayVolume)
  }
  return {
    labels: days,
    datasets: [{
      label: 'Volume (sets × reps)',
      data: volumes,
      backgroundColor: 'rgba(79, 70, 229, 0.6)',
      borderColor: 'rgba(79, 70, 229, 1)',
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false
    }]
  }
})

// ──── Monthly Line Chart (last 30 days, grouped by week) ────
const monthlyChartData = computed(() => {
  const weeks = []
  const volumes = []
  for (let w = 3; w >= 0; w--) {
    const weekEnd = new Date()
    weekEnd.setDate(weekEnd.getDate() - (w * 7))
    const weekStart = new Date(weekEnd)
    weekStart.setDate(weekStart.getDate() - 6)

    const label = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    weeks.push(label)

    const weekVolume = allUserWorkouts.value
      .filter(wo => {
        const d = new Date(wo.date)
        return d >= weekStart && d <= weekEnd
      })
      .reduce((sum, wo) => sum + (wo.sets * wo.reps), 0)
    volumes.push(weekVolume)
  }
  return {
    labels: weeks,
    datasets: [{
      label: 'Weekly Volume',
      data: volumes,
      borderColor: 'rgba(79, 70, 229, 1)',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgba(79, 70, 229, 1)',
      pointRadius: 5,
      pointHoverRadius: 8
    }]
  }
})

// ──── Doughnut Chart (training split) ────
const typeColors = {
  Strength: 'rgba(79, 70, 229, 0.8)',
  Cardio: 'rgba(34, 197, 94, 0.8)',
  Flexibility: 'rgba(251, 191, 36, 0.8)',
  Other: 'rgba(156, 163, 175, 0.8)'
}

const doughnutData = computed(() => {
  const labels = Object.keys(statsByType.value)
  const data = Object.values(statsByType.value)
  const colors = labels.map(l => typeColors[l] || 'rgba(156, 163, 175, 0.8)')
  return {
    labels,
    datasets: [{
      data,
      backgroundColor: colors,
      borderWidth: 0,
      hoverOffset: 8
    }]
  }
})

// ──── Chart Options ────
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: '#1e293b', titleFont: { size: 13 }, bodyFont: { size: 12 }, padding: 12, cornerRadius: 8 }
  },
  scales: {
    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 } } },
    x: { grid: { display: false }, ticks: { font: { size: 11 } } }
  }
}

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: '#1e293b', titleFont: { size: 13 }, bodyFont: { size: 12 }, padding: 12, cornerRadius: 8 }
  },
  scales: {
    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 } } },
    x: { grid: { display: false }, ticks: { font: { size: 11 } } }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 }, usePointStyle: true, pointStyle: 'circle' } },
    tooltip: { backgroundColor: '#1e293b', padding: 12, cornerRadius: 8 }
  }
}
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

.tracking-widest {
  letter-spacing: 0.1em;
}
</style>
