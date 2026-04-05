<template>
  <div class="container-fluid py-5 px-lg-5 fade-in">
    <div class="mb-5">
      <h1 class="display-5 fw-bold mb-1">Fitness News & Insights</h1>
      <p class="text-muted mb-0">Stay updated with the latest trends and expert tips.</p>
    </div>

    <!-- Filter Bar -->
    <div class="glass p-4 rounded-4 mb-5 shadow-sm">
      <div class="row g-3">
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold text-muted text-uppercase tracking-wider">Search Articles</label>
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0 rounded-start-pill ps-3">🔍</span>
            <input 
              v-model="filters.search" 
              type="text" 
              class="form-control border-start-0 rounded-end-pill py-2" 
              placeholder="Title, content, or topic..."
              @input="handleFilterChange"
            >
          </div>
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label small fw-bold text-muted text-uppercase tracking-wider">Date</label>
          <input 
            v-model="filters.date" 
            type="date" 
            class="form-control rounded-pill py-2"
            @change="handleFilterChange"
          >
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label small fw-bold text-muted text-uppercase tracking-wider">Category</label>
          <select 
            v-model="filters.category" 
            class="form-select rounded-pill py-2"
            @change="handleFilterChange"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0 fw-bold">Latest Updates</h4>
      <span class="text-muted small">Showing {{ filteredNews.length }} result(s)</span>
    </div>

    <!-- News List -->
    <div class="row g-4 mb-5">
      <div v-for="item in paginated" :key="item.id" class="col-12">
        <div class="card border-0 shadow-sm hover-lift-subtle overflow-hidden">
          <div class="card-body p-4 p-lg-5">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
              <div class="d-flex align-items-center gap-2">
                <span class="badge bg-primary-light text-primary px-3 py-2 rounded-pill fw-bold text-uppercase" style="font-size: 0.7rem">{{ item.category }}</span>
                <span class="text-muted small">•</span>
                <time class="text-muted small fw-medium">{{ item.date }}</time>
              </div>
            </div>
            <h3 class="fw-bold text-dark mb-3">{{ item.title }}</h3>
            <p class="card-text text-muted leading-relaxed mb-4">{{ item.content }}</p>
            <div 
              class="d-flex align-items-center text-primary fw-bold gap-2 cursor-pointer transition-all hover:gap-3"
              style="cursor: pointer;"
              @click="openArticle(item)"
            >
              Read full article <span>→</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="filteredNews.length === 0" class="col-12">
        <div class="glass border-0 rounded-4 text-center py-5 shadow-sm">
          <div class="display-1 text-muted opacity-25 mb-3">🗞️</div>
          <h4 class="fw-bold">No results found</h4>
          <p class="text-muted mb-0">Try adjusting your search or category filters.</p>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <nav v-if="totalPages > 1" class="mt-5">
      <ul class="pagination justify-content-center gap-2">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link border-0 rounded-3 px-4 py-2" @click="goTo(currentPage - 1)">Previous</button>
        </li>
        <li 
          v-for="page in totalPages" 
          :key="page" 
          class="page-item" 
          :class="{ active: currentPage === page }"
        >
          <button class="page-link border-0 rounded-3 px-3 py-2" @click="goTo(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link border-0 rounded-3 px-4 py-2" @click="goTo(currentPage + 1)">Next</button>
        </li>
      </ul>
    </nav>
  </div>

  <!-- Article Modal -->
  <Teleport to="body">
    <div v-if="selectedArticle" class="modal-backdrop fade show" style="z-index: 1040;"></div>
    <div 
      class="modal fade show d-block" 
      v-if="selectedArticle" 
      tabindex="-1" 
      style="z-index: 1050;"
      @click.self="closeArticle"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="modal-header border-0 pb-0 pt-4 px-4 px-md-5 d-flex justify-content-between align-items-start">
            <div class="d-flex align-items-center gap-2 mb-2">
              <span class="badge bg-primary-light text-primary px-3 py-2 rounded-pill fw-bold text-uppercase" style="font-size: 0.7rem">{{ selectedArticle.category }}</span>
              <span class="text-muted small">•</span>
              <time class="text-muted small fw-medium">{{ selectedArticle.date }}</time>
            </div>
            <button type="button" class="btn-close shadow-none" @click="closeArticle" aria-label="Close"></button>
          </div>
          
          <div class="modal-body px-4 px-md-5 pb-5 pt-3">
            <h2 class="fw-bold text-dark mb-4">{{ selectedArticle.title }}</h2>
            
            <div class="article-content text-dark" style="font-size: 1.1rem; line-height: 1.8;">
              <p class="mb-4 fw-medium text-muted border-start border-primary border-4 ps-3 py-2 bg-light rounded-end">
                {{ selectedArticle.content }}
              </p>
              <p class="mb-0">
                {{ selectedArticle.fullArticle }}
              </p>
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

.hover-lift-subtle {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift-subtle:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.leading-relaxed {
  line-height: 1.625;
}

.tracking-widest {
  letter-spacing: 0.1em;
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
</style>

<script>
import newsData from '../data/news.json'

export default {
  name: 'NewsPage',
  data() {
    return {
      filters: {
        search: '',
        date: '',
        category: ''
      },
      selectedArticle: null,
      currentPage: 1,
      itemsPerPage: 5
    }
  },
  computed: {
    categories() {
      const cats = newsData.map(n => n.category)
      return [...new Set(cats)].sort()
    },
    filteredNews() {
      return newsData.filter(item => {
        const matchesSearch = !this.filters.search || 
          item.title.toLowerCase().includes(this.filters.search.toLowerCase()) ||
          item.content.toLowerCase().includes(this.filters.search.toLowerCase()) ||
          item.category.toLowerCase().includes(this.filters.search.toLowerCase())
        
        const matchesDate = !this.filters.date || item.date === this.filters.date
        const matchesCategory = !this.filters.category || item.category === this.filters.category
        
        return matchesSearch && matchesDate && matchesCategory
      })
    },
    paginated() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredNews.slice(start, start + this.itemsPerPage)
    },
    totalPages() {
      return Math.ceil(this.filteredNews.length / this.itemsPerPage)
    }
  },
  methods: {
    openArticle(item) {
      this.selectedArticle = item
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    },
    closeArticle() {
      this.selectedArticle = null
      document.body.style.overflow = ''
    },
    goTo(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
    handleFilterChange() {
      this.goTo(1)
    }
  }
}
</script>
