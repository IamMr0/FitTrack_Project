<template>
  <div class="container-fluid py-5 px-3">
    <div class="col-12 col-md-10 col-lg-8 mx-auto">
      <h1 class="fw-bold mb-4">FitTrack Community</h1>

      <!-- New Post Box -->
      <div v-if="auth.isLoggedIn" class="card shadow-sm p-4 mb-5 border-0 bg-light">
        <h5 class="fw-bold mb-3">Share your progress</h5>
        <div class="mb-3">
          <textarea 
            v-model="postContent" 
            class="form-control border-0 shadow-none bg-white p-3" 
            rows="3" 
            placeholder="What's on your mind? Just finished a heavy leg day? 🦵"
          ></textarea>
        </div>
        <div class="text-end">
          <button @click="handlePost" class="btn btn-success px-4 fw-bold" :disabled="!postContent.trim()">
            Post Update
          </button>
        </div>
      </div>
      <div v-else class="alert alert-light border text-center py-4 mb-5">
        <p class="mb-3">Log in to join the conversation and share your gains!</p>
        <RouterLink to="/login" class="btn btn-success btn-sm">Login to Post</RouterLink>
      </div>

      <!-- Feed -->
      <div v-if="posts.length">
        <div v-for="post in posts" :key="post.id" class="card shadow-sm mb-4 border-0">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="d-flex align-items-center">
                <div class="avatar bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style="width: 45px; height: 45px;">
                  {{ post.userName.charAt(0) }}
                </div>
                <div>
                  <h6 class="fw-bold mb-0">{{ post.userName }}</h6>
                  <small class="text-muted">{{ post.date }}</small>
                </div>
              </div>
              <button 
                v-if="auth.isLoggedIn && (post.userId === auth.user.id || auth.isAdmin)" 
                @click="workoutStore.deletePost(post.id)" 
                class="btn btn-outline-danger btn-sm border-0"
              >
                Delete
              </button>
            </div>

            <p class="card-text mb-4 fs-5">{{ post.content }}</p>

            <div class="border-top pt-3 d-flex align-items-center">
              <button 
                @click="auth.isLoggedIn ? workoutStore.toggleLike(post.id) : null" 
                class="btn btn-sm d-flex align-items-center gap-2"
                :class="isLiked(post.likes) ? 'text-danger' : 'text-muted'"
                :disabled="!auth.isLoggedIn"
              >
                <span class="fs-5">{{ isLiked(post.likes) ? '❤️' : '🤍' }}</span>
                <span class="fw-bold">{{ post.likes.length }} {{ post.likes.length === 1 ? 'Like' : 'Likes' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5 text-muted">
        <p class="fs-5">No posts yet. Be the first to share your journey!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/authStore'
import { useWorkoutStore } from '../stores/workoutStore'

const auth = useAuthStore()
const workoutStore = useWorkoutStore()
const { posts } = storeToRefs(workoutStore)

const postContent = ref('')

const handlePost = () => {
  if (postContent.value.trim()) {
    workoutStore.addPost(postContent.value.trim())
    postContent.value = ''
  }
}

const isLiked = (likes) => {
  return auth.user && likes.includes(auth.user.id)
}
</script>

<style scoped>
.avatar {
  font-size: 1.2rem;
  background: linear-gradient(135deg, #198754, #20c997);
}
</style>
