<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <NavBar />
    <main class="flex-grow-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: { NavBar, Footer }
}
</script>
