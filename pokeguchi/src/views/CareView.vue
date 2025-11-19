<template>
  <div class="text-center relative">
    <h2 class="text-3xl font-bold mb-4">Care for {{ creature.name }}</h2>

    <CreatureDisplay />

    <div class="mb-6">
      <p>🍗 Hunger: {{ creature.hunger }}</p>
      <p>💖 Happiness: {{ creature.happiness }}</p>
      <p>💪 Strength: {{ creature.strength }}</p>
      <p>⚡ Level: {{ creature.level }}</p>
      <p>{{ creature.moodDescription }}</p>
    </div>

    <XPBar />

    <div class="flex justify-center space-x-4">
      <button @click="creature.feed()" class="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded">
        Feed 🍖
      </button>
      <button @click="creature.play()" class="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded">
        Play 🎮
      </button>
      <button @click="creature.train()" class="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded">
        Train 🏋️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCreatureStore } from '@/stores/creature'
import CreatureDisplay from '@/components/CreatureDisplay.vue'
import XPBar from '@/components/XPBar.vue'
const creature = useCreatureStore()
</script>

<style scoped>
img {
  filter: drop-shadow(0 0 10px rgba(244, 114, 182, 0.6));
}

.animate-fade {
  animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(5px);
  }
  20%,
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-5px);
  }
}
</style>
