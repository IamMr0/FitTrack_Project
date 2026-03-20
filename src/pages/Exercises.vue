<template>
  <div class="container-fluid py-5 px-lg-5 fade-in">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
      <div>
        <h1 class="display-5 fw-bold mb-1">Browse Exercises</h1>
        <p class="text-muted mb-0">Discover and learn from our comprehensive fitness database</p>
      </div>
      <div>
        <span v-if="isOffline" class="badge rounded-pill bg-warning text-dark px-3 py-2">
          ⚠️ API Key Missing
        </span>
        <span v-else class="badge rounded-pill bg-primary-light text-primary px-3 py-2">
          ● Live API Connected
        </span>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="glass p-4 rounded-4 mb-5 shadow-sm">
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <label for="exerciseSearch" class="form-label small fw-bold text-uppercase tracking-wider">Search</label>
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0 rounded-start-3">🔍</span>
            <input
              id="exerciseSearch"
              v-model="search"
              type="text"
              class="form-control border-start-0 rounded-end-3 py-2"
              placeholder="Search by name, equipment, or target..."
              @input="resetAndFetch"
            />
          </div>
        </div>
        <div class="col-12 col-md-6">
          <label for="exerciseBodyPart" class="form-label small fw-bold text-uppercase tracking-wider">Filter by Body Part</label>
          <select
            id="exerciseBodyPart"
            v-model="selectedBodyPart"
            class="form-select py-2 rounded-3"
            @change="resetAndFetch"
          >
            <option value="">All Body Parts</option>
            <option v-for="part in bodyParts" :key="part" :value="part">
              {{ part }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-4 text-muted fw-medium">Syncing with fit database...</p>
    </div>

    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0 fw-bold">Library</h4>
        <span class="badge bg-light text-dark border px-3 py-2 rounded-pill">
          {{ filteredExercises.length }} Exercises
        </span>
      </div>

      <!-- Exercise Grid -->
      <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4 g-4 mb-5">
        <div v-for="ex in paginated" :key="ex.id" class="col">
          <ExerciseCard :exercise="ex" @showDetails="showDetails" />
        </div>
      </div>

      <div
        v-if="filteredExercises.length === 0"
        class="alert bg-white border rounded-4 text-center py-5 shadow-sm"
      >
        <div class="display-1 text-muted mb-3">🔍</div>
        <h4 class="fw-bold">No results found</h4>
        <p class="text-muted">Try adjusting your search or category filters.</p>
        <button @click="search = ''; selectedBodyPart = ''; loadData()" class="btn btn-link text-primary fw-bold text-decoration-none">
          Clear all filters
        </button>
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="mt-5">
        <ul class="pagination justify-content-center gap-2">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link border-0 rounded-3 px-4 py-2" @click="goTo(currentPage - 1)">
              Previous
            </button>
          </li>
          <li
            v-for="page in visiblePages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link border-0 rounded-3 px-3 py-2" @click="goTo(page)">{{ page }}</button>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button class="page-link border-0 rounded-3 px-4 py-2" @click="goTo(currentPage + 1)">
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <!-- Exercise Details Modal (Teleported to body to avoid animation/transform conflicts) -->
  <Teleport to="body">
    <div
      class="modal fade"
      id="exerciseModal"
      tabindex="-1"
      aria-labelledby="exerciseModalLabel"
      aria-hidden="true"
      ref="modalRef"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div v-if="selectedExercise" class="modal-body p-0">
            <div class="row g-0">
              <div
                class="col-12 col-md-5 bg-white text-center p-4 d-flex align-items-center justify-content-center"
              >
                <div v-if="modalGifLoading" class="text-muted">
                  <div class="spinner-border text-primary" role="status"></div>
                </div>
                <img
                  v-else-if="modalGifSrc"
                  :src="modalGifSrc"
                  :alt="selectedExercise.name"
                  class="img-fluid rounded-4"
                />
                <div v-else class="text-muted display-4 opacity-25">💪</div>
              </div>
              <div class="col-12 col-md-7 p-4 p-lg-5">
                <div
                  class="d-flex justify-content-between align-items-start mb-3"
                >
                  <div>
                    <div class="text-primary small fw-bold text-uppercase tracking-widest mb-1"
                      >Exercise ID #{{ selectedExercise.id }}</div
                    >
                    <h2 class="fw-bold text-capitalize mb-0 display-6">
                      {{ selectedExercise.name }}
                    </h2>
                  </div>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                <div class="mb-4 d-flex flex-wrap gap-2">
                  <span class="badge bg-primary px-3 py-2 rounded-pill">{{
                    selectedExercise.bodyPart
                  }}</span>
                  <span class="badge bg-light text-dark border px-3 py-2 rounded-pill">{{
                    selectedExercise.target
                  }}</span>
                  <span class="badge bg-light text-dark border px-3 py-2 rounded-pill">{{
                    selectedExercise.equipment
                  }}</span>
                  <span class="badge bg-warning text-dark px-3 py-2 rounded-pill text-capitalize">{{
                    selectedExercise.difficulty || "beginner"
                  }}</span>
                </div>

                <div v-if="selectedExercise.description" class="mb-4">
                  <h6 class="fw-bold text-dark mb-2">Description</h6>
                  <p class="small text-muted mb-0 leading-relaxed">
                    {{ selectedExercise.description }}
                  </p>
                </div>

                <div v-if="selectedExercise.secondaryMuscles?.length" class="mb-4">
                  <h6 class="fw-bold text-dark mb-2">Secondary Muscles</h6>
                  <div class="d-flex flex-wrap gap-2">
                    <span v-for="m in selectedExercise.secondaryMuscles" :key="m" class="badge bg-primary-light text-primary px-3 py-2 rounded-pill border-0">{{ m }}</span>
                  </div>
                </div>

                <h6 class="fw-bold text-dark mb-2">Instructions</h6>
                <ol class="ps-3 mb-0 small text-muted leading-relaxed">
                  <li v-for="(step, idx) in selectedExercise.instructions" :key="idx" class="mb-2">
                    {{ step }}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.bg-primary-light {
  background-color: var(--primary-light);
}

.exercise-card-modern {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.exercise-card-modern:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.page-link {
  background: var(--card-bg);
  color: var(--primary);
  font-weight: 600;
}

.page-item.active .page-link {
  background: var(--primary);
  color: white;
}

.leading-relaxed {
  line-height: 1.625;
}

.tracking-widest {
  letter-spacing: 0.1em;
}

.tracking-tighter {
  letter-spacing: -0.02em;
}
</style>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import ExerciseCard from "../components/ExerciseCard.vue";
import {
  fetchExercises,
  fetchExercisesByBodyPart,
  fetchBodyPartList,
  fetchExerciseGif,
} from "../api/exerciseApi";
import { usePagination } from "../composables/usePagination";

const exercises = ref([]);
const bodyParts = ref([]);
const loading = ref(true);
const search = ref("");
const selectedBodyPart = ref("");
const isOffline = ref(
  !import.meta.env.VITE_RAPIDAPI_KEY ||
    import.meta.env.VITE_RAPIDAPI_KEY === "your_rapidapi_key_here",
);

const filteredExercises = computed(() => {
  return exercises.value.filter((ex) => {
    const term = search.value.toLowerCase();
    return (
      !term ||
      ex.name.toLowerCase().includes(term) ||
      ex.target.toLowerCase().includes(term) ||
      ex.equipment.toLowerCase().includes(term) ||
      ex.bodyPart.toLowerCase().includes(term)
    );
  });
});

const { currentPage, paginated, totalPages, goTo } = usePagination(
  filteredExercises,
  12,
);

const selectedExercise = ref(null);
const modalGifSrc = ref(null);
const modalGifLoading = ref(false);
let modalGifObjectUrl = null;

const showDetails = (ex) => {
  selectedExercise.value = ex;
};

// Watch selectedExercise to fetch the GIF whenever user opens a detail view
watch(selectedExercise, async (ex) => {
  // cleanup previous
  if (modalGifObjectUrl) {
    URL.revokeObjectURL(modalGifObjectUrl);
    modalGifObjectUrl = null;
  }
  modalGifSrc.value = null;
  if (!ex?.id) return;
  modalGifLoading.value = true;
  try {
    const url = await fetchExerciseGif(ex.id);
    modalGifObjectUrl = url;
    modalGifSrc.value = url;
  } finally {
    modalGifLoading.value = false;
  }
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const loadData = async () => {
  loading.value = true;
  try {
    const [exData, partData] = await Promise.all([
      selectedBodyPart.value
        ? fetchExercisesByBodyPart(selectedBodyPart.value)
        : fetchExercises(),
      fetchBodyPartList(),
    ]);
    exercises.value = exData;
    bodyParts.value = partData;
  } catch (error) {
    console.error("Error loading exercises:", error);
  } finally {
    loading.value = false;
  }
};

const resetAndFetch = () => {
  goTo(1);
  loadData();
};

onMounted(loadData);
</script>
