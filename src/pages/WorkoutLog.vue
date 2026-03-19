<template>
  <div class="container-fluid py-5 px-3">
    <h1 class="fw-bold mb-4">My Workout Log</h1>

    <!-- Log Form Card -->
    <div class="card shadow-sm p-4 mb-5 border-0 bg-light">
      <h4 class="fw-bold mb-4">{{ editingId ? 'Edit Workout' : 'Log New Workout' }}</h4>
      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label for="workoutExercise" class="form-label small fw-bold">Exercise Name</label>
            <input 
              id="workoutExercise" 
              v-focus 
              v-model="form.exercise" 
              type="text" 
              class="form-control" 
              placeholder="e.g. Bench Press" 
              required
            >
          </div>
          <div class="col-6 col-md-3">
            <label for="workoutDate" class="form-label small fw-bold">Date</label>
            <input id="workoutDate" v-model="form.date" type="date" class="form-control" required>
          </div>
          <div class="col-6 col-md-3">
            <label for="workoutType" class="form-label small fw-bold">Type</label>
            <select id="workoutType" v-model="form.type" class="form-select" required>
              <option value="Strength">Strength</option>
              <option value="Cardio">Cardio</option>
              <option value="Flexibility">Flexibility</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div class="col-4 col-md-2">
            <label for="sets" class="form-label small fw-bold">Sets</label>
            <input id="sets" v-model.number="form.sets" type="number" class="form-control" min="1" required>
          </div>
          <div class="col-4 col-md-2">
            <label for="reps" class="form-label small fw-bold">Reps</label>
            <input id="reps" v-model.number="form.reps" type="number" class="form-control" min="1" required>
          </div>
          <div class="col-4 col-md-2">
            <label for="weight" class="form-label small fw-bold">Weight (kg)</label>
            <input id="weight" v-model.number="form.weight" type="number" class="form-control" min="0">
          </div>
          <div class="col-12 col-md-6">
            <label for="muscle" class="form-label small fw-bold">Muscle Group</label>
            <select id="muscle" v-model="form.muscle" class="form-select" required>
              <option v-for="m in muscles" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>

          <div class="col-12">
            <label for="notes" class="form-label small fw-bold">Notes (Optional)</label>
            <textarea id="notes" v-model="form.notes" class="form-control" rows="2" placeholder="How did it feel?"></textarea>
          </div>
        </div>

        <div class="mt-4 d-flex gap-2">
          <button type="submit" class="btn btn-success px-4">
            {{ editingId ? 'Update Workout' : 'Add Workout' }}
          </button>
          <button v-if="editingId" type="button" @click="cancelEdit" class="btn btn-outline-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Filters -->
    <div class="row g-3 mb-4 align-items-end">
      <div class="col-12 col-md-4">
        <label class="form-label small fw-bold text-muted">Search Logs</label>
        <input v-model="localFilters.search" type="text" class="form-control" placeholder="Search exercises..." @input="applyFilters">
      </div>
      <div class="col-6 col-md-3">
        <label class="form-label small fw-bold text-muted">Filter Type</label>
        <select v-model="localFilters.type" class="form-select" @change="applyFilters">
          <option value="">All Types</option>
          <option value="Strength">Strength</option>
          <option value="Cardio">Cardio</option>
          <option value="Flexibility">Flexibility</option>
        </select>
      </div>
      <div class="col-6 col-md-3">
        <label class="form-label small fw-bold text-muted">Filter Muscle</label>
        <select v-model="localFilters.muscle" class="form-select" @change="applyFilters">
          <option value="">All Muscles</option>
          <option v-for="m in muscles" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>
      <div class="col-12 col-md-2">
        <button @click="resetFilters" class="btn btn-outline-secondary w-100">Reset</button>
      </div>
    </div>

    <!-- Workout List -->
    <div class="row g-4">
      <div v-for="w in filteredUserWorkouts" :key="w.id" class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 class="fw-bold mb-1" v-highlight="'#e8f5e9'">{{ w.exercise }}</h5>
                <p class="text-muted small mb-0">{{ w.date }} — <span class="badge bg-light text-dark border">{{ w.type }}</span></p>
              </div>
              <div class="d-flex gap-2">
                <button @click="startEdit(w)" class="btn btn-outline-primary btn-sm">Edit</button>
                <button @click="handleDelete(w.id)" class="btn btn-outline-danger btn-sm">Delete</button>
              </div>
            </div>
            
            <div class="row text-center bg-light rounded p-3 g-2">
              <div class="col-4">
                <div class="text-muted small">Sets</div>
                <div class="fw-bold h5 mb-0">{{ w.sets }}</div>
              </div>
              <div class="col-4 border-start border-end">
                <div class="text-muted small">Reps</div>
                <div class="fw-bold h5 mb-0">{{ w.reps }}</div>
              </div>
              <div class="col-4">
                <div class="text-muted small">Weight</div>
                <div class="fw-bold h5 mb-0">{{ w.weight }}kg</div>
              </div>
            </div>

            <div v-if="w.notes" class="mt-3 small text-muted italic">
              "{{ w.notes }}"
            </div>
            
            <div class="mt-3">
              <span class="badge bg-secondary">{{ w.muscle }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredUserWorkouts.length === 0" class="col-12 text-center py-5">
        <div class="opacity-50 mb-3">
          <i class="bi bi-journal-text" style="font-size: 3rem;"></i>
        </div>
        <h5 class="text-muted">No workouts found.</h5>
        <p class="text-muted small">Start by logging a new activity above!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkoutStore } from '../stores/workoutStore'

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
