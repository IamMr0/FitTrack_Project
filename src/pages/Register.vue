<template>
  <div class="container py-5">
    <div class="col-12 col-md-6 col-lg-5 mx-auto">
      <div class="card shadow-sm p-4">
        <h2 class="fw-bold mb-4 text-center">Create Account</h2>

        <div v-if="error" class="alert alert-danger mb-3 py-2 small">
          {{ error }}
        </div>
        <div v-if="success" class="alert alert-success mb-3 py-2 small">
          Registration successful! Redirecting to login...
        </div>

        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label for="firstName" class="form-label">First Name</label>
            <input 
              id="firstName" 
              v-model="form.firstName" 
              v-focus
              type="text" 
              class="form-control" 
              :class="{ 'is-invalid': v$.firstName.$error }"
            >
            <div class="invalid-feedback">First name is required.</div>
          </div>

          <div class="mb-3">
            <label for="lastName" class="form-label">Last Name</label>
            <input 
              id="lastName" 
              v-model="form.lastName" 
              type="text" 
              class="form-control" 
              :class="{ 'is-invalid': v$.lastName.$error }"
            >
            <div class="invalid-feedback">Last name is required.</div>
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email" 
              v-model="form.email" 
              type="email" 
              class="form-control" 
              :class="{ 'is-invalid': v$.email.$error }"
            >
            <div class="invalid-feedback">Please enter a valid email.</div>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input 
              id="password" 
              v-model="form.password" 
              type="password" 
              class="form-control" 
              :class="{ 'is-invalid': v$.password.$error }"
            >
            <div class="invalid-feedback">Password must be at least 6 characters.</div>
          </div>

          <div class="mb-4">
            <label for="confirm" class="form-label">Confirm Password</label>
            <input 
              id="confirm" 
              v-model="form.confirm" 
              type="password" 
              class="form-control" 
              :class="{ 'is-invalid': v$.confirm.$error }"
            >
            <div class="invalid-feedback">Passwords do not match.</div>
          </div>

          <button type="submit" class="btn btn-success w-100 fw-bold py-2" :disabled="loading">
            {{ loading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>

        <p class="text-center mt-4 mb-0">
          Already have an account? <RouterLink to="/login" class="text-success fw-bold">Login here</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirm: ''
})

const v$ = reactive({
  firstName: { $error: false },
  lastName: { $error: false },
  email: { $error: false },
  password: { $error: false },
  confirm: { $error: false }
})

const error = ref('')
const success = ref(false)
const loading = ref(false)

const handleRegister = () => {
  // Simple validation reset
  Object.keys(v$).forEach(key => v$[key].$error = false)
  error.value = ''

  // Validation
  let isValid = true
  if (!form.firstName) { v$.firstName.$error = true; isValid = false }
  if (!form.lastName) { v$.lastName.$error = true; isValid = false }
  if (!form.email || !form.email.includes('@')) { v$.email.$error = true; isValid = false }
  if (!form.password || form.password.length < 6) { v$.password.$error = true; isValid = false }
  if (form.password !== form.confirm) { v$.confirm.$error = true; isValid = false }

  if (!isValid) return

  loading.value = true
  const res = auth.register(form.firstName, form.lastName, form.email, form.password)
  
  if (res.success) {
    success.value = true
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } else {
    error.value = res.message
  }
  loading.value = false
}
</script>
