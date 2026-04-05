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

<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../stores/authStore'

export default {
  name: 'RegisterPage',
  computed: {
    ...mapStores(useAuthStore)
  },
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirm: ''
      },
      v$: {
        firstName: { $error: false },
        lastName: { $error: false },
        email: { $error: false },
        password: { $error: false },
        confirm: { $error: false }
      },
      error: '',
      success: false,
      loading: false
    }
  },
  methods: {
    async handleRegister() {
      // Reset validation
      Object.keys(this.v$).forEach(key => this.v$[key].$error = false)
      this.error = ''

      // Validation
      let isValid = true
      if (!this.form.firstName) { this.v$.firstName.$error = true; isValid = false }
      if (!this.form.lastName) { this.v$.lastName.$error = true; isValid = false }
      if (!this.form.email || !this.form.email.includes('@')) { this.v$.email.$error = true; isValid = false }
      const hasUppercase = /[A-Z]/.test(this.form.password)
      const hasNumber = /[0-9]/.test(this.form.password)
      const hasSymbol = /[^A-Za-z0-9]/.test(this.form.password)
      if (!this.form.password || this.form.password.length < 8 || !hasUppercase || !hasNumber || !hasSymbol) {
        this.v$.password.$error = true; isValid = false
      }
      if (this.form.password !== this.form.confirm) { this.v$.confirm.$error = true; isValid = false }

      if (!isValid) return

      this.loading = true
      const res = await this.authStore.register(
        this.form.firstName, this.form.lastName, this.form.email, this.form.password
      )
      if (res.success) {
        this.success = true
        setTimeout(() => { this.$router.push('/login') }, 1500)
      } else {
        this.error = res.message
      }
      this.loading = false
    }
  }
}
</script>
