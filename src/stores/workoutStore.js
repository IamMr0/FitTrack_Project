import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'

export const useWorkoutStore = defineStore('workout', () => {
  const workouts = ref(JSON.parse(localStorage.getItem('fittrack_workouts')) || [])
  const posts = ref(JSON.parse(localStorage.getItem('fittrack_posts')) || [])
  const filter = ref({ type: '', muscle: '', search: '' })

  const auth = useAuthStore()

  const filteredUserWorkouts = computed(() => {
    if (!auth.user) return []
    return workouts.value
      .filter(w => w.userId === auth.user.id)
      .filter(w => {
        const matchesSearch = !filter.value.search || w.exercise.toLowerCase().includes(filter.value.search.toLowerCase())
        const matchesType = !filter.value.type || w.type === filter.value.type
        const matchesMuscle = !filter.value.muscle || w.muscle === filter.value.muscle
        return matchesSearch && matchesType && matchesMuscle
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  const statsByType = computed(() => {
    if (!auth.user) return {}
    const userWorkouts = workouts.value.filter(w => w.userId === auth.user.id)
    return userWorkouts.reduce((acc, w) => {
      acc[w.type] = (acc[w.type] || 0) + 1
      return acc
    }, {})
  })

  const weeklyVolume = computed(() => {
    if (!auth.user) return 0
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    return workouts.value
      .filter(w => w.userId === auth.user.id && new Date(w.date) >= oneWeekAgo)
      .reduce((total, w) => total + (w.sets * w.reps), 0)
  })

  function persist() {
    localStorage.setItem('fittrack_workouts', JSON.stringify(workouts.value))
  }

  function persistPosts() {
    localStorage.setItem('fittrack_posts', JSON.stringify(posts.value))
  }

  function addWorkout(workout) {
    const newWorkout = {
      ...workout,
      id: Date.now(),
      userId: auth.user.id
    }
    workouts.value.unshift(newWorkout)
    persist()
  }

  function updateWorkout(id, updated) {
    const index = workouts.value.findIndex(w => w.id === id)
    if (index !== -1) {
      workouts.value[index] = { ...workouts.value[index], ...updated }
      persist()
    }
  }

  function deleteWorkout(id) {
    workouts.value = workouts.value.filter(w => w.id !== id)
    persist()
  }

  function setFilter(partial) {
    Object.assign(filter.value, partial)
  }

  function resetFilter() {
    filter.value = { type: '', muscle: '', search: '' }
  }

  function addPost(content) {
    const newPost = {
      id: Date.now(),
      userId: auth.user.id,
      userName: `${auth.user.firstName} ${auth.user.lastName}`,
      content,
      date: new Date().toISOString().split('T')[0],
      likes: []
    }
    posts.value.unshift(newPost)
    persistPosts()
  }

  function toggleLike(postId) {
    const post = posts.value.find(p => p.id === postId)
    if (post && auth.user) {
      const likeIndex = post.likes.indexOf(auth.user.id)
      if (likeIndex === -1) {
        post.likes.push(auth.user.id)
      } else {
        post.likes.splice(likeIndex, 1)
      }
      persistPosts()
    }
  }

  function deletePost(postId) {
    posts.value = posts.value.filter(p => p.id !== postId)
    persistPosts()
  }

  return {
    workouts,
    posts,
    filter,
    filteredUserWorkouts,
    statsByType,
    weeklyVolume,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    setFilter,
    resetFilter,
    addPost,
    toggleLike,
    deletePost
  }
})
