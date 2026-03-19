import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import Home from '../pages/Home.vue'
import News from '../pages/News.vue'
import About from '../pages/About.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Dashboard from '../pages/Dashboard.vue'
import Exercises from '../pages/Exercises.vue'
import WorkoutLog from '../pages/WorkoutLog.vue'
import Community from '../pages/Community.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/news', component: News },
  { path: '/about', component: About },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/exercises', component: Exercises },
  { path: '/workouts', component: WorkoutLog, meta: { requiresAuth: true } },
  { path: '/community', component: Community }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
