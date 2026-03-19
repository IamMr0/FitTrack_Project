import { ref, computed } from 'vue'

export function usePagination(items, perPage = 5) {
  const currentPage = ref(1)

  const paginated = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return items.value.slice(start, start + perPage)
  })

  const totalPages = computed(() => {
    return Math.ceil(items.value.length / perPage)
  })

  function goTo(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  return {
    currentPage,
    paginated,
    totalPages,
    goTo
  }
}
