<template>
  <div class="container py-5">
    <div class="col-12 col-md-6 col-lg-4 mx-auto">
      <div class="card shadow-sm p-4">
        <h2 class="fw-bold mb-4 text-center">Login</h2>

        <div v-if="error" class="alert alert-danger mb-3 py-2 small">
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email" 
              v-model="form.email" 
              v-focus
              type="email" 
              class="form-control" 
              required
            >
          </div>

          <div class="mb-4">
            <label for="password" class="form-label">Password</label>
            <input 
              id="password" 
              v-model="form.password" 
              type="password" 
              class="form-control" 
              required
            >
          </div>

          <button type="submit" class="btn btn-success w-100 fw-bold py-2">
            Login
          </button>
        </form>

        <p class="text-center mt-4 mb-0">
          No account? <RouterLink to="/register" class="text-success fw-bold">Register here</RouterLink>
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
