<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white font-sans"
  >
    <!-- HEADER -->
    <header
      class="flex items-center justify-between px-4 py-3 bg-slate-950 shadow-md fixed top-0 w-full z-50"
    >
      <h1 class="text-2xl font-bold text-pink-400 tracking-wide">Pokeguchi</h1>

      <!-- mobile nav toggle -->
      <button class="md:hidden text-pink-300 focus:outline-none" @click="showMenu = !showMenu">
        <svg
          v-if="!showMenu"
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- DESKTOP NAV -->
      <nav class="hidden md:flex space-x-6 text-sm font-medium">
        <RouterLink to="/" class="hover:text-pink-300 transition">Home</RouterLink>
        <RouterLink to="/care" class="hover:text-pink-300 transition">Care</RouterLink>
        <RouterLink to="/battle" class="hover:text-pink-300 transition">Battle</RouterLink>
        <RouterLink to="/about" class="hover:text-pink-300 transition">About</RouterLink>
      </nav>
    </header>

    <!-- MOBILE NAV DROPDOWN -->
    <transition name="slide-fade">
      <nav
        v-if="showMenu"
        class="md:hidden bg-slate-950 flex flex-col items-center py-4 mt-14 space-y-4 shadow-md"
      >
        <RouterLink
          v-for="(item, i) in links"
          :key="i"
          :to="item.path"
          class="text-lg hover:text-pink-300"
          @click="showMenu = false"
        >
          {{ item.name }}
        </RouterLink>
      </nav>
    </transition>

    <!-- MAIN CONTENT -->
    <main class="flex-grow px-4 pt-20 pb-10 md:px-8">
      <RouterView />
    </main>

    <!-- FOOTER -->
    <footer class="bg-slate-950 p-4 text-center text-xs text-gray-400 border-t border-slate-800">
      © 2025 Pokeguchi • Evolve wisely.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showMenu = ref(false)
const links = [
  { name: 'Home', path: '/' },
  { name: 'Care', path: '/care' },
  { name: 'Battle', path: '/battle' },
  { name: 'About', path: '/about' },
]
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
