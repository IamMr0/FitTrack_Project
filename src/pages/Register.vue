<template>
  <div class="container py-5 d-flex align-items-center fade-in">
    <div class="col-12 col-md-6 col-lg-5 mx-auto">
      <div class="glass p-4 p-lg-5 rounded-4 shadow-lg border-0">
        <div class="text-center mb-5">
           <div class="display-4 mb-2">🚀</div>
           <h2 class="fw-bold text-dark">Create Account</h2>
           <p class="text-muted small">Start your fitness transformation today</p>
        </div>

        <div v-if="error" class="alert bg-danger-light text-danger mb-4 py-2 small border-0 text-center rounded-3">
          {{ error }}
        </div>
        <div v-if="success" class="alert bg-primary-light text-primary mb-4 py-3 small border-0 text-center rounded-3">
          Registration successful! Redirecting to login...
        </div>

        <form @submit.prevent="handleRegister">
          <div class="row g-3">
            <div class="col-12 col-sm-6 mb-3">
              <label for="firstName" class="form-label small fw-bold text-uppercase tracking-wider">First Name</label>
              <input 
                id="firstName" 
                v-model="form.firstName" 
                v-focus
                type="text" 
                class="form-control py-2 rounded-3" 
                :class="{ 'is-invalid': v$.firstName.$error }"
                placeholder="John"
                aria-describedby="firstNameFeedback"
              >
              <div id="firstNameFeedback" class="invalid-feedback">First name is required.</div>
            </div>

            <div class="col-12 col-sm-6 mb-3">
              <label for="lastName" class="form-label small fw-bold text-uppercase tracking-wider">Last Name</label>
              <input 
                id="lastName" 
                v-model="form.lastName" 
                type="text" 
                class="form-control py-2 rounded-3" 
                :class="{ 'is-invalid': v$.lastName.$error }"
                placeholder="Doe"
                aria-describedby="lastNameFeedback"
              >
              <div id="lastNameFeedback" class="invalid-feedback">Last name is required.</div>
            </div>
          </div>

          <div class="mb-3">
            <label for="email" class="form-label small fw-bold text-uppercase tracking-wider">Email Address</label>
            <input 
              id="email" 
              v-model="form.email" 
              type="email" 
              class="form-control py-2 rounded-3" 
              :class="{ 'is-invalid': v$.email.$error }"
              placeholder="name@example.com"
              aria-describedby="emailFeedback"
            >
            <div id="emailFeedback" class="invalid-feedback">Please enter a valid email.</div>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label small fw-bold text-uppercase tracking-wider">Password</label>
            <input 
              id="password" 
              v-model="form.password" 
              type="password" 
              class="form-control py-2 rounded-3" 
              :class="{ 'is-invalid': v$.password.$error }"
              placeholder="Min. 8 chars, 1 uppercase, 1 number, 1 symbol"
              aria-describedby="passwordFeedback"
            >
            <div id="passwordFeedback" class="invalid-feedback">Password must be at least 8 characters with 1 uppercase letter, 1 number, and 1 symbol.</div>
          </div>

          <div class="mb-4">
            <label for="confirm" class="form-label small fw-bold text-uppercase tracking-wider">Confirm Password</label>
            <input 
              id="confirm" 
              v-model="form.confirm" 
              type="password" 
              class="form-control py-2 rounded-3" 
              :class="{ 'is-invalid': v$.confirm.$error }"
              placeholder="Repeat password"
              aria-describedby="confirmFeedback"
            >
            <div id="confirmFeedback" class="invalid-feedback">Passwords do not match.</div>
          </div>

          <button type="submit" class="btn btn-primary w-100 fw-bold py-3 rounded-pill shadow" :disabled="loading">
            {{ loading ? 'Creating Account...' : 'Register Now' }}
          </button>
        </form>

        <p class="text-center mt-5 mb-0 text-muted">
          Already have an account? <RouterLink to="/login" class="text-primary fw-bold text-decoration-none">Login here</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-danger-light {
  background-color: rgba(220, 53, 69, 0.1);
}

.bg-primary-light {
  background-color: var(--primary-light);
}

.tracking-wider {
  letter-spacing: 0.05em;
}
</style>

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

const handleRegister = async () => {
  // Simple validation reset
  Object.keys(v$).forEach(key => v$[key].$error = false)
  error.value = ''

  // Validation
  let isValid = true
  if (!form.firstName) { v$.firstName.$error = true; isValid = false }
  if (!form.lastName) { v$.lastName.$error = true; isValid = false }
  if (!form.email || !form.email.includes('@')) { v$.email.$error = true; isValid = false }
  const hasUppercase = /[A-Z]/.test(form.password)
  const hasNumber = /[0-9]/.test(form.password)
  const hasSymbol = /[^A-Za-z0-9]/.test(form.password)
  if (!form.password || form.password.length < 8 || !hasUppercase || !hasNumber || !hasSymbol) {
    v$.password.$error = true; isValid = false
  }
  if (form.password !== form.confirm) { v$.confirm.$error = true; isValid = false }

  if (!isValid) return

  loading.value = true
  const res = await auth.register(form.firstName, form.lastName, form.email, form.password)
  
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
