<template>
  <div
    key="app-layout"
    class="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white font-sans"
  >
    <!-- HEADER -->
    <header
      class="flex items-center justify-between px-4 py-3 bg-slate-950 shadow-md fixed top-0 w-full z-50"
    >
      <h1 class="text-2xl font-bold text-pink-400 tracking-wide">Pokeguchi</h1>

      <nav class="hidden md:flex space-x-6 text-sm font-medium items-center">
        <RouterLink v-if="auth.user" to="/" class="hover:text-pink-300 transition">Home</RouterLink>
        <RouterLink v-if="auth.user" to="/care" class="hover:text-pink-300 transition"
          >Care</RouterLink
        >
        <RouterLink v-if="auth.user" to="/battle" class="hover:text-pink-300 transition"
          >Battle</RouterLink
        >
        <RouterLink v-if="auth.user" to="/about" class="hover:text-pink-300 transition"
          >About</RouterLink
        >
        <RouterLink v-if="auth.user" to="/inventory" class="hover:text-pink-300 transition"
          >Inventory</RouterLink
        >

        <!-- Only show login/register if not logged in -->
        <RouterLink v-if="!auth.user" to="/auth" class="hover:text-pink-300 transition">
          Login
        </RouterLink>

        <!-- Logout button -->
        <button
          v-if="auth.user"
          @click="handleLogout"
          class="bg-pink-500 hover:bg-pink-600 px-3 py-1 rounded-md text-white font-medium transition"
        >
          Logout
        </button>
      </nav>
    </header>

    <!-- MAIN CONTENT -->
    <main class="flex-grow px-4 pt-20 pb-10 md:px-8">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- FOOTER -->
    <footer class="bg-slate-950 p-4 text-center text-xs text-gray-400 border-t border-slate-800">
      © 2025 Pokeguchi • Evolve wisely.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const fadingOut = ref(false)

async function handleLogout() {
  fadingOut.value = true
  await new Promise((resolve) => setTimeout(resolve, 300)) // fade out effect
  await auth.signOut()
  router.push('/auth')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
