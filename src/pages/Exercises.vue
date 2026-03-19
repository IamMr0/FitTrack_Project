<template>
  <div class="container-fluid py-5 px-3">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="fw-bold mb-0">Browse Exercises</h1>
      <span v-if="isOffline" class="badge bg-warning text-dark"
        >Offline Mode (Local Data)</span
      >
    </div>

    <!-- Filter Bar -->
    <div class="card shadow-sm p-4 mb-4">
      <div class="row g-3">
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold">Search</label>
          <input
            v-model="search"
            type="text"
            class="form-control"
            placeholder="Search by name, equipment, or target..."
            @input="resetAndFetch"
          />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold">Body Part</label>
          <select
            v-model="selectedBodyPart"
            class="form-select"
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
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Fetching exercises...</p>
    </div>

    <div v-else>
      <div class="mb-3">
        <small class="text-muted"
          >Showing {{ filteredExercises.length }} result(s)</small
        >
      </div>

      <!-- Exercise Grid -->
      <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 mb-5">
        <div v-for="ex in paginated" :key="ex.id" class="col">
          <div class="card h-100 shadow-sm border-0 exercise-card">
            <div
              class="card-img-top bg-light text-center p-3 d-flex align-items-center justify-content-center"
              style="height: 200px"
            >
              <img
                :src="getExerciseGifUrl(ex.id)"
                :alt="ex.name"
                class="img-fluid rounded"
                style="max-height: 100%"
              />
            </div>
            <div class="card-body p-4">
              <div class="d-flex flex-wrap gap-2 mb-2">
                <span class="badge bg-success">{{ ex.bodyPart }}</span>
                <span class="badge bg-secondary">{{ ex.target }}</span>
              </div>
              <h5 class="card-title fw-bold text-capitalize">{{ ex.name }}</h5>
              <div class="text-muted small mb-3">
                <strong>Equipment:</strong> {{ ex.equipment }}<br />
                <strong>Difficulty:</strong>
                <span class="text-capitalize">{{
                  ex.difficulty || "beginner"
                }}</span>
              </div>
              <button
                @click="showDetails(ex)"
                class="btn btn-outline-success btn-sm w-100 fw-bold"
                data-bs-toggle="modal"
                data-bs-target="#exerciseModal"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Exercise Details Modal -->
      <div
        class="modal fade"
        id="exerciseModal"
        tabindex="-1"
        aria-labelledby="exerciseModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content border-0 shadow">
            <div v-if="selectedExercise" class="modal-body p-0">
              <div class="row g-0">
                <div
                  class="col-12 col-md-5 bg-light text-center p-4 d-flex align-items-center justify-content-center"
                >
                  <img
                    :src="getExerciseGifUrl(selectedExercise.id)"
                    :alt="selectedExercise.name"
                    class="img-fluid rounded shadow-sm"
                  />
                </div>
                <div class="col-12 col-md-7 p-4 p-lg-5">
                  <div
                    class="d-flex justify-content-between align-items-start mb-2"
                  >
                    <div>
                      <span class="text-muted small fw-bold text-uppercase"
                        >ID: #{{ selectedExercise.id }}</span
                      >
                      <h3 class="fw-bold text-capitalize mb-0">
                        {{ selectedExercise.name }}
                      </h3>
                    </div>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>

                  <div class="mb-4 d-flex flex-wrap gap-2">
                    <span class="badge bg-success">{{
                      selectedExercise.bodyPart
                    }}</span>
                    <span class="badge bg-secondary">{{
                      selectedExercise.target
                    }}</span>
                    <span class="badge bg-info text-dark">{{
                      selectedExercise.equipment
                    }}</span>
                    <span class="badge bg-warning text-dark text-capitalize">{{
                      selectedExercise.difficulty || "beginner"
                    }}</span>
                    <span class="badge bg-dark text-capitalize">{{
                      selectedExercise.category || "strength"
                    }}</span>
                  </div>

                  <div v-if="selectedExercise.description" class="mb-4">
                    <h6 class="fw-bold small text-uppercase text-muted">
                      Description
                    </h6>
                    <p class="small text-muted mb-0">
                      {{ selectedExercise.description }}
                    </p>
                  </div>

                  <div
                    v-if="selectedExercise.secondaryMuscles?.length"
                    class="mb-4"
                  >
                    <h6 class="fw-bold small text-uppercase text-muted">
                      Secondary Muscles
                    </h6>
                    <div class="d-flex flex-wrap gap-2">
                      <span
                        v-for="m in selectedExercise.secondaryMuscles"
                        :key="m"
                        class="badge bg-light text-dark border"
                        >{{ m }}</span
                      >
                    </div>
                  </div>

                  <h6 class="fw-bold small text-uppercase text-muted">
                    Instructions
                  </h6>
                  <ol class="ps-3 mb-0 small text-muted">
                    <li
                      v-for="(step, idx) in selectedExercise.instructions"
                      :key="idx"
                      class="mb-1"
                    >
                      {{ step }}
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="filteredExercises.length === 0"
        class="alert alert-light border text-center py-5"
      >
        No exercises found matching your criteria.
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" aria-label="Exercises pagination">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goTo(currentPage - 1)">
              Previous
            </button>
          </li>
          <li
            v-for="page in visiblePages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="goTo(page)">{{ page }}</button>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button class="page-link" @click="goTo(currentPage + 1)">
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  fetchExercises,
  fetchExercisesByBodyPart,
  fetchBodyPartList,
  getExerciseGifUrl,
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

const showDetails = (ex) => {
  selectedExercise.value = ex;
};

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
