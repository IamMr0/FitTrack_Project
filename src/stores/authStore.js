import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('fittrack_user')) || null)
  const users = ref(JSON.parse(localStorage.getItem('fittrack_users')) || [])

  const isLoggedIn = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function register(firstName, lastName, email, password) {
    const exists = users.value.find(u => u.email === email)
    if (exists) return { success: false, message: 'Email already registered.' }

    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      password, // In a real app, never store plain text passwords
      role: users.value.length === 0 ? 'admin' : 'user'
    }

    users.value.push(newUser)
    localStorage.setItem('fittrack_users', JSON.stringify(users.value))
    return { success: true }
  }

  function login(email, password) {
    const found = users.value.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, message: 'Invalid email or password.' }

    user.value = { 
      id: found.id, 
      firstName: found.firstName, 
      lastName: found.lastName, 
      email: found.email, 
      role: found.role 
    }
    localStorage.setItem('fittrack_user', JSON.stringify(user.value))
    return { success: true }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('fittrack_user')
  }

  return {
    user,
    users,
    isLoggedIn,
    isAdmin,
    register,
    login,
    logout
  }
})
