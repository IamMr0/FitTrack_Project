<template>
  <div class="container-fluid py-5 px-3">
    <h1 class="fw-bold mb-4">Fitness News & Tips</h1>

    <!-- Filter Bar -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-md-6">
        <input 
          v-model="filters.search" 
          type="text" 
          class="form-control" 
          placeholder="Search title, content, or category..."
          @input="handleFilterChange"
        >
      </div>
      <div class="col-12 col-md-3">
        <input 
          v-model="filters.date" 
          type="date" 
          class="form-control"
          @change="handleFilterChange"
        >
      </div>
      <div class="col-12 col-md-3">
        <select 
          v-model="filters.category" 
          class="form-select"
          @change="handleFilterChange"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>

    <div class="mb-3">
      <small class="text-muted">Showing {{ filteredNews.length }} result(s)</small>
    </div>

    <!-- News List -->
    <div class="row g-4 mb-5">
      <div v-for="item in paginated" :key="item.id" class="col-12">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title fw-bold mb-0">{{ item.title }}</h5>
              <span class="badge bg-success">{{ item.category }}</span>
            </div>
            <p class="text-muted small mb-3">{{ item.date }}</p>
            <p class="card-text">{{ item.content }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="filteredNews.length === 0" class="col-12">
        <div class="alert alert-light border text-center py-5">
          No news found matching your filters.
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <nav v-if="totalPages > 1" aria-label="News pagination">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="goTo(currentPage - 1)">Previous</button>
        </li>
        <li 
          v-for="page in totalPages" 
          :key="page" 
          class="page-item" 
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="goTo(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goTo(currentPage + 1)">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import newsData from '../data/news.json'
import { usePagination } from '../composables/usePagination'

const filters = reactive({
  search: '',
  date: '',
  category: ''
})

const categories = computed(() => {
  const cats = newsData.map(n => n.category)
  return [...new Set(cats)].sort()
})

const filteredNews = computed(() => {
  return newsData.filter(item => {
    const matchesSearch = !filters.search || 
      item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.content.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.category.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesDate = !filters.date || item.date === filters.date
    const matchesCategory = !filters.category || item.category === filters.category
    
    return matchesSearch && matchesDate && matchesCategory
  })
})

const { currentPage, paginated, totalPages, goTo } = usePagination(filteredNews, 5)

const handleFilterChange = () => {
  goTo(1)
}
</script>
