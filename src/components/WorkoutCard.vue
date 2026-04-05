<template>
  <div class="card mb-2 shadow-sm border-0">
    <div class="card-body d-flex justify-content-between flex-wrap align-items-center p-3 p-lg-4">
      <div>
        <div class="fw-bold text-dark text-capitalize">{{ workout.exercise }}</div>
        <div class="text-muted small">
          {{ workout.date }}
          <span class="ms-2 badge bg-primary-light text-primary rounded-pill text-capitalize">{{ workout.type }}</span>
          <span v-if="workout.muscle" class="ms-1 badge bg-light text-muted border rounded-pill text-capitalize">{{ workout.muscle }}</span>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2 mt-2 mt-md-0">
        <span class="badge bg-light text-dark border px-3 py-2 rounded-pill">
          {{ workout.sets }}×{{ workout.reps }}
          <span v-if="workout.weight" class="ms-1 text-muted">{{ workout.weight }}kg</span>
        </span>
        <button v-if="showActions" @click="$emit('edit', workout)" class="btn btn-outline-primary btn-sm px-3 rounded-pill">Edit</button>
        <button v-if="showActions" @click="$emit('delete', workout.id)" class="btn btn-outline-danger btn-sm px-3 rounded-pill">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkoutCard',
  props: {
    workout: {
      type: Object,
      required: true
    },
    showActions: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete']
}
</script>

<style scoped>
.bg-primary-light {
  background-color: var(--primary-light);
}
</style>
