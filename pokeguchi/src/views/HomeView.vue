<template>
  <div
    class="flex flex-col items-center justify-center text-center min-h-[calc(100vh-140px)] px-6 mt-[70px]"
  >
    <h1 class="text-5xl md:text-6xl font-extrabold text-pink-400 drop-shadow-lg mb-6">Pokeguchi</h1>

    <p class="max-w-md text-gray-300 mb-10 leading-relaxed text-base md:text-lg">
      Raise, evolve, and battle your AI-generated companion.<br />
      Every choice you make shapes its growth and powers.
    </p>

    <RouterLink
      to="/care"
      class="px-8 py-3 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white font-semibold rounded-xl shadow-lg transition-transform transform hover:scale-105"
    >
      Start Caring →
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '../lib/supabase'
supabase.from('creatures').select('*').then(console.log)
</script>
