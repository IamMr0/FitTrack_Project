<template>
  <div class="card border-0 shadow-sm overflow-hidden hover-lift-subtle">
    <div class="card-body p-4 p-lg-5">
      <div class="d-flex justify-content-between align-items-start mb-4">
        <div class="d-flex align-items-center">
          <div class="avatar-gradient text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3 shadow-sm" style="width: 50px; height: 50px;">
            {{ post.userName.charAt(0) }}
          </div>
          <div>
            <h6 class="fw-bold mb-1 text-dark fs-5">{{ post.userName }}</h6>
            <small class="text-muted fw-medium d-flex align-items-center gap-1">
              🕒 {{ post.date }}
            </small>
          </div>
        </div>
        <button
          v-if="canDelete"
          @click="$emit('delete', post.id)"
          class="btn btn-link text-danger text-decoration-none p-0 fw-bold small"
        >
          Delete
        </button>
      </div>

      <p class="card-text mb-4 fs-5 text-dark leading-relaxed">{{ post.content }}</p>

      <div class="pt-4 border-top d-flex align-items-center">
        <button
          @click="$emit('toggleLike', post.id)"
          class="btn border-0 d-flex align-items-center gap-2 p-0 transition-transform"
          :disabled="!isLoggedIn"
        >
          <div class="like-btn-inner d-flex align-items-center justify-content-center p-2 rounded-circle"
               :class="hasLiked ? 'bg-danger-light text-danger' : 'bg-light text-muted'">
            <span class="fs-5">{{ hasLiked ? '❤️' : '🤍' }}</span>
          </div>
          <span class="fw-bold text-muted small">{{ post.likes.length }} {{ post.likes.length === 1 ? 'Like' : 'Likes' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../stores/authStore'

export default {
  name: 'PostCard',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  emits: ['delete', 'toggleLike'],
  computed: {
    ...mapStores(useAuthStore),
    isLoggedIn() { return this.authStore.isLoggedIn },
    canDelete() {
      return this.authStore.isLoggedIn &&
        (this.authStore.isAdmin || this.post.userId === this.authStore.user?.id)
    },
    hasLiked() {
      return this.authStore.user && this.post.likes.includes(this.authStore.user.id)
    }
  }
}
</script>

<style scoped>
.avatar-gradient {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  font-size: 1.25rem;
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

.like-btn-inner {
  transition: background-color 0.2s ease, color 0.2s ease;
}

.like-btn-inner:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
