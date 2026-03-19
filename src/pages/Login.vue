<template>
  <div class="container py-5 min-vh-80 d-flex align-items-center fade-in">
    <div class="col-12 col-md-6 col-lg-4 mx-auto">
      <div class="glass p-5 rounded-4 shadow-lg border-0">
        <div class="text-center mb-5">
           <div class="display-4 mb-2">💪</div>
           <h2 class="fw-bold text-dark">Welcome Back</h2>
           <p class="text-muted small">Enter your credentials to continue your journey</p>
        </div>

        <div v-if="error" class="alert bg-danger-light text-danger mb-4 py-2 small border-0 text-center rounded-3">
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label small fw-bold text-uppercase tracking-wider">Email Address</label>
            <input 
              id="email" 
              v-model="form.email" 
              v-focus
              type="email" 
              class="form-control py-2 rounded-3" 
              placeholder="name@example.com"
              required
            >
          </div>

          <div class="mb-4">
            <label for="password" class="form-label small fw-bold text-uppercase tracking-wider">Password</label>
            <input 
              id="password" 
              v-model="form.password" 
              type="password" 
              class="form-control py-2 rounded-3" 
              placeholder="••••••••"
              required
            >
          </div>

          <button type="submit" class="btn btn-primary w-100 fw-bold py-3 rounded-pill shadow-sm">
            Login
          </button>
        </form>

        <p class="text-center mt-5 mb-0 text-muted">
          Don't have an account? <RouterLink to="/register" class="text-primary fw-bold text-decoration-none">Create one</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.min-vh-80 {
  min-height: 80vh;
}

.bg-danger-light {
  background-color: rgba(220, 53, 69, 0.1);
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
  email: '',
  password: ''
})

const error = ref('')

const handleLogin = () => {
  error.value = ''
  const res = auth.login(form.email, form.password)
  
  if (res.success) {
    router.push('/dashboard')
  } else {
    error.value = res.message
  }
}
</script>
