<template>
  <div class="container-fluid py-5 px-lg-5 fade-in">
    <div class="col-12 col-md-10 col-lg-8 mx-auto">
      <div class="text-center mb-5">
        <h1 class="display-5 fw-bold mb-1">FitTrack Community</h1>
        <p class="text-muted">Connect, share, and inspire others on their journey.</p>
      </div>

      <!-- New Post Box -->
      <div v-if="auth.isLoggedIn" class="glass p-4 rounded-4 mb-5 shadow-sm border-0">
        <div class="d-flex align-items-center mb-3 gap-3">
           <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style="width: 40px; height: 40px;">
              {{ auth.user.firstName.charAt(0) }}
           </div>
           <h5 class="fw-bold mb-0 text-dark">Share your progress</h5>
        </div>
        <div class="mb-3">
          <textarea 
            v-model="postContent" 
            class="form-control border-0 rounded-4 shadow-none bg-white p-4" 
            rows="3" 
            placeholder="What's on your mind? Just finished a heavy leg day? 🦵"
            style="font-size: 1.1rem"
          ></textarea>
        </div>
        <div class="text-end">
          <button @click="handlePost" class="btn btn-primary px-5 py-2 rounded-pill fw-bold shadow-sm" :disabled="!postContent.trim()">
            Post Update
          </button>
        </div>
      </div>
      <div v-else class="glass p-5 rounded-4 text-center border-0 mb-5 shadow-sm">
        <div class="display-4 mb-3">👋</div>
        <h4 class="fw-bold text-dark">Join the conversation</h4>
        <p class="text-muted mb-4">Log in to share your gains and connect with the community!</p>
        <RouterLink to="/login" class="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow">
          Login to Get Started
        </RouterLink>
      </div>

      <!-- Feed -->
      <div v-if="posts.length">
        <div v-for="post in posts" :key="post.id" class="card border-0 shadow-sm mb-4 overflow-hidden hover-lift-subtle">
          <div class="card-body p-4 p-lg-5">
            <div class="d-flex justify-content-between align-items-start mb-4">
              <div class="d-flex align-items-center">
                <div class="avatar-gradient text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3 shadow-sm" style="width: 50px; height: 50px;">
                  {{ post.userName.charAt(0) }}
                </div>
                <div>
                  <h6 class="fw-bold mb-1 text-dark fs-5">{{ post.userName }}</h6>
                  <small class="text-muted fw-medium d-flex align-items-center gap-1">
                    <i class="bi bi-clock">🕒</i>
                    {{ post.date }}
                  </small>
                </div>
              </div>
              <button 
                v-if="auth.isLoggedIn && (post.userId === auth.user.id || auth.isAdmin)" 
                @click="workoutStore.deletePost(post.id)" 
                class="btn btn-link text-danger text-decoration-none p-0 fw-bold small"
              >
                Delete
              </button>
            </div>

            <p class="card-text mb-4 fs-5 text-dark leading-relaxed">{{ post.content }}</p>

            <div class="pt-4 border-top d-flex align-items-center">
              <button 
                @click="auth.isLoggedIn ? workoutStore.toggleLike(post.id) : null" 
                class="btn border-0 d-flex align-items-center gap-2 p-0 transition-transform active:scale-90"
                :disabled="!auth.isLoggedIn"
              >
                <div class="like-btn-inner d-flex align-items-center justify-content-center p-2 rounded-circle transition-colors"
                     :class="isLiked(post.likes) ? 'bg-danger-light text-danger' : 'bg-light text-muted'">
                  <span class="fs-5">{{ isLiked(post.likes) ? '❤️' : '🤍' }}</span>
                </div>
                <span class="fw-bold text-muted small">{{ post.likes.length }} {{ post.likes.length === 1 ? 'Like' : 'Likes' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5 text-muted opacity-50">
        <div class="display-1 mb-3">💬</div>
        <p class="fs-5">No posts yet. Be the first to share your journey!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-gradient {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  font-size: 1.25rem;
}

.bg-primary-light {
  background-color: var(--primary-light);
}

.bg-danger-light {
  background-color: rgba(220, 53, 69, 0.1);
}

.hover-lift-subtle {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift-subtle:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.leading-relaxed {
  line-height: 1.6;
}

.transition-transform {
  transition: transform 0.1s ease;
}

.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease;
}

.like-btn-inner:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>

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
