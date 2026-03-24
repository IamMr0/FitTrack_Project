import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

// Pre-hashed password for the default admin account (password: 'admin123')
// Generated with bcrypt.hashSync('admin123', 10)
const DEFAULT_ADMIN = {
  id: 1,
  firstName: 'Admin',
  lastName: 'FitTrack',
  email: 'admin@fittrack.com',
  password: bcrypt.hashSync('admin123', SALT_ROUNDS),
  role: 'admin'
}

function seedAdmin(usersList) {
  const adminExists = usersList.find(u => u.email === DEFAULT_ADMIN.email)
  if (!adminExists) {
    usersList.push({ ...DEFAULT_ADMIN })
    localStorage.setItem('fittrack_users', JSON.stringify(usersList))
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('fittrack_user')) || null)
  const users = ref(JSON.parse(localStorage.getItem('fittrack_users')) || [])

  // Ensure admin account always exists
  seedAdmin(users.value)

  const isLoggedIn = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function register(firstName, lastName, email, password) {
    // Block admin email registration
    if (email.toLowerCase().endsWith('@fittrack.com')) {
      return { success: false, message: 'Registration with @fittrack.com emails is not allowed.' }
    }

    const exists = users.value.find(u => u.email === email)
    if (exists) return { success: false, message: 'Email already registered.' }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'user'
    }

    users.value.push(newUser)
    localStorage.setItem('fittrack_users', JSON.stringify(users.value))
    return { success: true }
  }

  async function login(email, password) {
    const found = users.value.find(u => u.email === email)
    if (!found) return { success: false, message: 'Invalid email or password.' }

    // Compare entered password against stored hash
    const isMatch = await bcrypt.compare(password, found.password)
    if (!isMatch) return { success: false, message: 'Invalid email or password.' }

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
