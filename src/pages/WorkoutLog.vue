<template>
  <div class="container-fluid py-5 px-lg-5 fade-in">
    <div class="mb-5">
      <h1 class="display-5 fw-bold mb-1">Workout Log</h1>
      <p class="text-muted mb-0">Track your progress and stay consistent.</p>
    </div>

    <!-- Log Form Card -->
    <div class="glass p-4 p-lg-5 rounded-4 mb-5 shadow-sm border-0">
      <div class="d-flex align-items-center mb-4 gap-3">
        <div class="feature-icon-sm bg-primary text-white">
          <i class="bi bi-plus-lg">+</i>
        </div>
        <h4 class="fw-bold mb-0 text-dark">{{ editingId ? 'Update Activity' : 'Log New Session' }}</h4>
        <span id="formInstructions" class="visually-hidden">Fill in the workout details below to track your progress.</span>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="row g-4">
          <div class="col-12 col-md-6">
          <label for="workoutExercise" class="form-label small fw-bold text-uppercase tracking-wider">Exercise Name</label>
          <div class="position-relative">
            <input
              id="workoutExercise"
              v-focus
              v-model="form.exercise"
              type="text"
              class="form-control py-2 rounded-3"
              placeholder="e.g. Bench Press"
              required
              autocomplete="off"
              aria-describedby="formInstructions"
              @input="onExerciseInput"
              @keydown.escape="clearSuggestions"
              @keydown.down.prevent="highlightNext"
              @keydown.up.prevent="highlightPrev"
              @keydown.enter.prevent="selectHighlighted"
              @blur="hideSuggestionsDelayed"
            >
            <!-- Autocomplete dropdown -->
            <ul
              v-if="suggestions.length > 0"
              class="autocomplete-dropdown list-unstyled mb-0 position-absolute w-100 bg-white border rounded-3 shadow-sm"
              style="z-index: 1050; top: calc(100% + 4px); max-height: 220px; overflow-y: auto;"
              role="listbox"
              aria-label="Exercise suggestions"
            >
              <li
                v-for="(sug, idx) in suggestions"
                :key="sug.id"
                @mousedown.prevent="selectSuggestion(sug)"
                class="autocomplete-item px-3 py-2 text-capitalize small fw-medium"
                :class="{ 'bg-primary text-white': idx === highlightIndex }"
                role="option"
              >
                {{ sug.name }}
                <span class="ms-2 opacity-50" style="font-size: 0.7rem; font-weight: 400;">{{ sug.bodyPart }}</span>
              </li>
            </ul>
            <!-- Loading spinner inside field -->
            <div v-if="suggestionsLoading" class="position-absolute top-50 end-0 translate-middle-y pe-3">
              <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
            </div>
          </div>
          </div>
          <div class="col-6 col-md-3">
            <label for="workoutDate" class="form-label small fw-bold text-uppercase tracking-wider">Date</label>
            <input id="workoutDate" v-model="form.date" type="date" class="form-control py-2 rounded-3" required>
          </div>
          <div class="col-6 col-md-3">
            <label for="workoutType" class="form-label small fw-bold text-uppercase tracking-wider">Category</label>
            <select id="workoutType" v-model="form.type" class="form-select py-2 rounded-3" required>
              <option value="Strength">Strength</option>
              <option value="Cardio">Cardio</option>
              <option value="Flexibility">Flexibility</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div class="col-4 col-md-2">
            <label for="sets" class="form-label small fw-bold text-uppercase tracking-wider">Sets</label>
            <input id="sets" v-model.number="form.sets" type="number" class="form-control py-2 rounded-3" min="1" required>
          </div>
          <div class="col-4 col-md-2">
            <label for="reps" class="form-label small fw-bold text-uppercase tracking-wider">Reps</label>
            <input id="reps" v-model.number="form.reps" type="number" class="form-control py-2 rounded-3" min="1" required>
          </div>
          <div class="col-4 col-md-2">
            <label for="weight" class="form-label small fw-bold text-uppercase tracking-wider">Weight (kg)</label>
            <input id="weight" v-model.number="form.weight" type="number" class="form-control py-2 rounded-3" min="0">
          </div>
          <div class="col-12 col-md-6">
            <label for="muscle" class="form-label small fw-bold text-uppercase tracking-wider">Target Muscle</label>
            <select id="muscle" v-model="form.muscle" class="form-select py-2 rounded-3" required>
              <option v-for="m in muscles" :key="m" :value="m" class="text-capitalize">{{ m }}</option>
            </select>
          </div>

          <div class="col-12">
            <label for="notes" class="form-label small fw-bold text-uppercase tracking-wider">Observations</label>
            <textarea id="notes" v-model="form.notes" class="form-control rounded-3" rows="2" placeholder="How did it feel? Any personal bests?"></textarea>
          </div>
        </div>

        <div class="mt-5 d-flex gap-3">
          <button type="submit" class="btn btn-primary px-5 py-2 rounded-pill shadow">
            {{ editingId ? 'Save Changes' : 'Log Activity' }}
          </button>
          <button v-if="editingId" type="button" @click="cancelEdit" class="btn btn-outline-secondary px-4 rounded-pill">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Filters -->
    <div class="row g-4 mb-5 align-items-end">
      <div class="col-12 col-md-4">
        <label class="form-label small fw-bold text-muted text-uppercase tracking-tighter">Search My Logs</label>
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0 rounded-start-pill ps-3">🔍</span>
          <input 
            id="filterSearch"
            v-model="localFilters.search" 
            type="text" 
            class="form-control border-start-0 rounded-end-pill py-2" 
            placeholder="Exercise name..." 
            @input="applyFilters"
          >
        </div>
      </div>
      <div class="col-6 col-md-3">
        <label for="filterType" class="form-label small fw-bold text-muted text-uppercase tracking-tighter">Category</label>
        <select id="filterType" v-model="localFilters.type" class="form-select rounded-pill py-2" @change="applyFilters">
          <option value="">All Categories</option>
          <option value="Strength">Strength</option>
          <option value="Cardio">Cardio</option>
          <option value="Flexibility">Flexibility</option>
        </select>
      </div>
      <div class="col-6 col-md-3">
        <label for="filterMuscle" class="form-label small fw-bold text-muted text-uppercase tracking-tighter">Muscle</label>
        <select id="filterMuscle" v-model="localFilters.muscle" class="form-select rounded-pill py-2" @change="applyFilters">
          <option value="">All Muscles</option>
          <option v-for="m in muscles" :key="m" :value="m" class="text-capitalize">{{ m }}</option>
        </select>
      </div>
      <div class="col-12 col-md-2">
        <button @click="resetFilters" class="btn btn-outline-primary w-100 rounded-pill py-2 fw-bold">Reset</button>
      </div>
    </div>

    <!-- Workout List -->
    <TransitionGroup name="workout-list" tag="div" class="row g-4">
      <div v-for="w in filteredUserWorkouts" :key="w.id" class="col-12">
        <div class="card border-0 shadow-sm hover-lift">
          <div class="card-body p-4 p-lg-5">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-4 gap-3">
              <div>
                <div class="d-flex align-items-center gap-2 mb-2">
                   <span class="badge bg-primary-light text-primary rounded-pill px-3 py-2 text-uppercase fw-bold" style="font-size: 0.7rem">{{ w.type }}</span>
                   <span class="text-muted small">•</span>
                   <time class="text-muted small fw-medium">{{ w.date }}</time>
                </div>
                <h3 class="fw-bold text-dark text-capitalize mb-0">{{ w.exercise }}</h3>
              </div>
              <div class="d-flex gap-2">
                <button @click="startEdit(w)" class="btn btn-light btn-sm px-3 rounded-pill border fw-bold text-primary">Edit</button>
                <button @click="handleDelete(w.id)" class="btn btn-outline-danger btn-sm px-3 rounded-pill fw-bold">Delete</button>
              </div>
            </div>
            
            <div class="row g-3">
              <div class="col-12 col-md-8">
                <div class="row text-center bg-light rounded-4 p-4 g-2">
                  <div class="col-4">
                    <div class="text-muted small text-uppercase fw-bold tracking-widest mb-1" style="font-size: 0.65rem">Sets</div>
                    <div class="fw-bold h4 mb-0 text-dark">{{ w.sets }}</div>
                  </div>
                  <div class="col-4 border-start border-end">
                    <div class="text-muted small text-uppercase fw-bold tracking-widest mb-1" style="font-size: 0.65rem">Reps</div>
                    <div class="fw-bold h4 mb-0 text-dark">{{ w.reps }}</div>
                  </div>
                  <div class="col-4">
                    <div class="text-muted small text-uppercase fw-bold tracking-widest mb-1" style="font-size: 0.65rem">Weight</div>
                    <div class="fw-bold h4 mb-0 text-primary">{{ w.weight }}<span class="small ms-1">kg</span></div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-4 d-flex align-items-center">
                <div class="ps-md-4">
                   <div class="text-muted small text-uppercase fw-bold tracking-widest mb-2" style="font-size: 0.65rem">Targeted Muscle</div>
                   <span class="badge bg-white text-dark border px-4 py-2 rounded-pill text-capitalize fw-bold shadow-sm">{{ w.muscle }}</span>
                </div>
              </div>
            </div>

            <div v-if="w.notes" class="mt-4 p-3 bg-primary-light rounded-3 border-start border-primary border-4">
              <div class="small fw-bold text-primary text-uppercase mb-1" style="font-size: 0.6rem">Personal Notes</div>
              <div class="text-dark small lh-base font-italic font-medium">"{{ w.notes }}"</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredUserWorkouts.length === 0" class="col-12 text-center py-5">
        <div class="display-1 text-muted opacity-25 mb-4">
          <i class="bi bi-journal-text">📝</i>
        </div>
        <h4 class="fw-bold text-dark">No records found</h4>
        <p class="text-muted">Your training log is currently empty. Start your journey today!</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkoutStore } from '../stores/workoutStore'
import { fetchExercisesByName } from '../api/exerciseApi'

const workoutStore = useWorkoutStore()
const { filteredUserWorkouts } = storeToRefs(workoutStore)

const muscles = ['chest', 'back', 'upper legs', 'lower legs', 'shoulders', 'upper arms', 'waist', 'cardio', 'full body']

const initialForm = {
  exercise: '',
  date: new Date().toISOString().split('T')[0],
  type: 'Strength',
  sets: 3,
  reps: 10,
  weight: 0,
  muscle: 'chest',
  notes: ''
}

const form = reactive({ ...initialForm })
const editingId = ref(null)

// --- Autocomplete state ---
const suggestions = ref([])
const suggestionsLoading = ref(false)
const highlightIndex = ref(-1)
let debounceTimer = null

const onExerciseInput = () => {
  highlightIndex.value = -1
  clearTimeout(debounceTimer)
  if (!form.exercise.trim()) {
    suggestions.value = []
    return
  }
  suggestionsLoading.value = true
  debounceTimer = setTimeout(async () => {
    suggestions.value = await fetchExercisesByName(form.exercise, 5)
    suggestionsLoading.value = false
  }, 300)
}

const selectSuggestion = (sug) => {
  form.exercise = sug.name
  if (sug.bodyPart) {
    // Auto-set muscle group if it matches our options
    const muscleMap = {
      waist: 'waist', back: 'back', chest: 'chest',
      shoulders: 'shoulders', 'upper arms': 'upper arms',
      'lower arms': 'upper arms', 'upper legs': 'upper legs',
      'lower legs': 'lower legs', cardio: 'cardio'
    }
    const matched = muscleMap[sug.bodyPart.toLowerCase()]
    if (matched) form.muscle = matched
  }
  suggestions.value = []
  highlightIndex.value = -1
}

const clearSuggestions = () => {
  suggestions.value = []
  highlightIndex.value = -1
}

const hideSuggestionsDelayed = () => {
  setTimeout(() => { suggestions.value = [] }, 150)
}

const highlightNext = () => {
  if (highlightIndex.value < suggestions.value.length - 1) highlightIndex.value++
}

const highlightPrev = () => {
  if (highlightIndex.value > 0) highlightIndex.value--
}

const selectHighlighted = () => {
  if (highlightIndex.value >= 0 && suggestions.value[highlightIndex.value]) {
    selectSuggestion(suggestions.value[highlightIndex.value])
  }
}

const localFilters = reactive({
  search: '',
  type: '',
  muscle: ''
})

const handleSubmit = () => {
  if (editingId.value) {
    workoutStore.updateWorkout(editingId.value, { ...form })
    editingId.value = null
  } else {
    workoutStore.addWorkout({ ...form })
  }
  Object.assign(form, initialForm)
}

const startEdit = (workout) => {
  editingId.value = workout.id
  Object.assign(form, workout)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
  editingId.value = null
  Object.assign(form, initialForm)
}

const handleDelete = (id) => {
  if (confirm('Are you sure you want to delete this workout?')) {
    workoutStore.deleteWorkout(id)
  }
}

const applyFilters = () => {
  workoutStore.setFilter(localFilters)
}

const resetFilters = () => {
  Object.assign(localFilters, { search: '', type: '', muscle: '' })
  workoutStore.resetFilter()
}

onMounted(() => {
  workoutStore.resetFilter()
})
</script>

<style scoped>
.feature-icon-sm {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-primary-light {
  background-color: var(--primary-light);
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.tracking-widest {
  letter-spacing: 0.1em;
}

.tracking-tighter {
  letter-spacing: -0.02em;
}

.font-italic {
  font-style: italic;
}

.autocomplete-item {
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.autocomplete-item:hover {
  background-color: var(--primary-light);
  color: var(--primary);
}

.workout-list-enter-active,
.workout-list-leave-active {
  transition: all 0.35s ease;
}

.workout-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.workout-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
